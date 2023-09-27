import { aliasedTable, and, asc, desc, eq, gte, ilike, lte, sql } from 'drizzle-orm';
import { products, productsTransactions, transactions, users } from '../../schema';
import { db } from '$lib/db';
import { getMonthName } from '$lib/utils';

export async function getCumulativeSales(year: number) {
	try {
		const transactionMonth = sql<number>`date_part('month', ${transactions.createdAt})`;
		const monthlySales = await db
			.select({
				month: transactionMonth,
				totalRevenue: sql<number>`sum(${products.price} * ${productsTransactions.quantity})::bigint`,
				totalUnits: sql<number>`sum(${productsTransactions.quantity})::bigint`
			})
			.from(transactions)
			.innerJoin(productsTransactions, eq(productsTransactions.transactionId, transactions.id))
			.innerJoin(products, eq(products.id, productsTransactions.productId))
			.where(eq(sql<number>`date_part('year', ${transactions.createdAt})`, year))
			.groupBy(transactionMonth)
			.orderBy(transactionMonth);
		const result = monthlySales.reduce((result, sales, i) => {
			const month = getMonthName(sales.month);
			let totalRevenue = parseInt(sales.totalRevenue as unknown as string) / 100;
			let totalUnits = parseInt(sales.totalUnits as unknown as string);
			if (i > 0) {
				totalRevenue += result[i - 1].totalRevenue;
				totalUnits += result[i - 1].totalUnits;
			}
			result.push({ month, totalRevenue, totalUnits });
			return result;
		}, [] as { month: string; totalRevenue: number; totalUnits: number }[]);
		return result;
	} catch (error) {
		console.error(error);
		return [];
	}
}

export async function getSalesByCategory(year: number) {
	try {
		const data = await db
			.select({
				category: products.category,
				totalRevenue: sql<number>`sum(${products.price} * ${productsTransactions.quantity})::bigint`
			})
			.from(transactions)
			.innerJoin(productsTransactions, eq(productsTransactions.transactionId, transactions.id))
			.innerJoin(products, eq(products.id, productsTransactions.productId))
			.where(eq(sql<number>`date_part('year', ${transactions.createdAt})`, year))
			.groupBy(products.category)
			.orderBy((a) => desc(a.totalRevenue));
		console.log('data', data);
		const result = data.map((sales) => {
			const totalRevenue = parseInt(sales.totalRevenue as unknown as string) / 100;
			return { category: sales.category, totalRevenue };
		});
		return result;
	} catch {
		return [];
	}
}

export type TransactionSearchParams = {
	transactionId?: number;
	customer?: string;
	affiliate?: string;
	minPrice?: number;
	maxPrice?: number;
};

export async function getTransactions(
	pageIndex: number,
	pageSize: number,
	searchParams?: TransactionSearchParams,
	sortBy?: string,
	orderBy?: string
) {
	try {
		const customers = aliasedTable(users, 'customers');
		const affiliates = aliasedTable(users, 'affiliates');
		const trQuery = db
			.select({
				transactionId: transactions.id,
				customerName: sql<string>`${customers.name}`.as('customerName'),
				affiliateName: sql<string>`${affiliates.name}`.as('affiliateName'),
				productId: sql`${products.id}`.as('productId'),
				productName: sql`${products.name}`.as('productName'),
				quantity: productsTransactions.quantity,
				price: products.price,
				createdAt: transactions.createdAt
			})
			.from(transactions)
			.innerJoin(productsTransactions, eq(productsTransactions.transactionId, transactions.id))
			.innerJoin(products, eq(productsTransactions.productId, products.id))
			.innerJoin(customers, and(eq(customers.id, transactions.customerId)))
			.innerJoin(affiliates, and(eq(affiliates.id, transactions.affiliateId)))
			.where(() => {
				const searchConditions: ReturnType<typeof ilike>[] = [];

				if (searchParams?.customer?.length) {
					searchConditions.push(ilike(customers.name, `%${searchParams.customer}%`));
				}
				if (searchParams?.affiliate?.length) {
					searchConditions.push(ilike(affiliates.name, `%${searchParams.affiliate}%`));
				}
				if (searchConditions.length > 0) {
					return and(...searchConditions);
				}
				return undefined;
			});

		const transactionRecords = db.$with('tr').as(trQuery);

		const query = db
			.with(transactionRecords)
			.select({
				transactionId: transactionRecords.transactionId,
				amount: sql<number>`sum(${transactionRecords.price} * ${transactionRecords.quantity})`
					.mapWith((v) => {
						return Number(v) / 100;
					})
					.as('amount'),
				customer: sql<string>`array_agg(${transactionRecords.customerName})`
					.mapWith((v) => v[0] as string)
					.as('customer'),
				affiliate: sql`array_agg(${transactionRecords.affiliateName})`
					.mapWith((v) => v[0] as string)
					.as('affiliate'),
				products: sql`json_strip_nulls(json_agg(
							json_build_object('id', ${transactionRecords.productId}, 'name', ${transactionRecords.productName}, 'price', ${transactionRecords.price}, 'quantity', ${transactionRecords.quantity})
							order by ${transactionRecords.productId}
						))`
					.mapWith((arr) => {
						return arr.map((d: { price: number }) => {
							d.price /= 100;
							return d;
						}) as { id: number; price: number; name: string; quantity: number }[];
					})
					.as('products'),
				createdAt: transactionRecords.createdAt
			})
			.from(transactionRecords)
			.groupBy(transactionRecords.transactionId, transactionRecords.createdAt)
			.having((tr) => {
				const searchConditions: ReturnType<typeof eq | typeof gte | typeof lte | typeof ilike>[] =
					[];
				if (searchParams?.transactionId && !isNaN(searchParams.transactionId)) {
					searchConditions.push(eq(tr.transactionId, searchParams.transactionId));
				}

				if (searchParams?.minPrice && !isNaN(searchParams.minPrice)) {
					searchConditions.push(gte(tr.amount, searchParams.minPrice * 100));
				}
				if (searchParams?.maxPrice && !isNaN(searchParams.maxPrice)) {
					searchConditions.push(lte(tr.amount, searchParams.maxPrice * 100));
				}
				if (searchConditions.length > 0) {
					return and(...searchConditions);
				}
				return undefined;
			});

		const aggregateQuery = db.$with('aggregate_query').as(query);

		const countResult = await db
			.with(aggregateQuery)
			.select({ count: sql<number>`count(${aggregateQuery.transactionId})`.mapWith(Number) })
			.from(aggregateQuery);

		const data = await db
			.with(aggregateQuery)
			.select()
			.from(aggregateQuery)
			.offset(pageIndex * pageSize)
			.limit(pageSize)
			.orderBy(() => {
				const defaultOrder = [desc(aggregateQuery.createdAt), asc(aggregateQuery.transactionId)];
				if (!sortBy || !orderBy) {
					return defaultOrder;
				}
				if (sortBy === 'amount') {
					if (orderBy === 'desc') {
						return [desc(aggregateQuery.amount), asc(aggregateQuery.transactionId)];
					} else {
						return [asc(aggregateQuery.amount), asc(aggregateQuery.transactionId)];
					}
				}
				if (sortBy === 'date') {
					if (orderBy === 'desc') {
						return [desc(aggregateQuery.createdAt), asc(aggregateQuery.transactionId)];
					} else {
						return [asc(aggregateQuery.createdAt), asc(aggregateQuery.transactionId)];
					}
				}
				return defaultOrder;
			});
		return { count: countResult[0].count, data };
	} catch (error) {
		console.log('error', error);
		return {
			count: 0,
			data: []
		};
	}
}
