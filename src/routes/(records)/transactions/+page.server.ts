import { db } from '$lib/db';
import { aliasedTable, and, asc, desc, eq, gte, ilike, lte, sql } from 'drizzle-orm';
import { products, productsTransactions, transactions, users } from '../../../schema';
import { getNullableVal } from '$lib/utils';

type TransactionSearchParams = {
	transactionId?: number;
	customer?: string;
	affiliate?: string;
	minPrice?: number;
	maxPrice?: number;
};

export async function load({ url }) {
	const pageStr = url.searchParams.get('page');
	const pageSizeStr = url.searchParams.get('pageSize');
	const page = pageStr ? parseInt(pageStr) : 1;
	const pageSize = pageSizeStr ? parseInt(pageSizeStr) : 10;
	const sortBy = getNullableVal(url.searchParams.get('sort_by'), undefined, String);
	const orderBy = getNullableVal(url.searchParams.get('order_by'), undefined, String);
	const searchParams = {
		transactionId: getNullableVal(url.searchParams.get('id'), undefined, (d) => parseInt(d)),
		customer: getNullableVal(url.searchParams.get('customer'), undefined),
		affiliate: getNullableVal(url.searchParams.get('affiliate'), undefined),
		minPrice: getNullableVal(url.searchParams.get('minPrice'), undefined, (d) => parseInt(d)),
		maxPrice: getNullableVal(url.searchParams.get('maxPrice'), undefined, (d) => parseInt(d))
	} satisfies TransactionSearchParams;

	async function getTransactions(
		pageIndex: number,
		pageSize: number,
		searchParams: TransactionSearchParams
	) {
		try {
			console.time('query_transactions');

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

					if (searchParams.customer?.length) {
						searchConditions.push(ilike(customers.name, `%${searchParams.customer}%`));
					}
					if (searchParams.affiliate?.length) {
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
							}) as { id: number; price: number; name: string }[];
						})
						.as('products'),
					createdAt: transactionRecords.createdAt
				})
				.from(transactionRecords)
				.groupBy(transactionRecords.transactionId, transactionRecords.createdAt)
				.having((tr) => {
					const searchConditions: ReturnType<typeof eq | typeof gte | typeof lte | typeof ilike>[] =
						[];
					if (searchParams.transactionId && !isNaN(searchParams.transactionId)) {
						searchConditions.push(eq(tr.transactionId, searchParams.transactionId));
					}

					if (searchParams.minPrice && !isNaN(searchParams.minPrice)) {
						searchConditions.push(gte(tr.amount, searchParams.minPrice * 100));
					}
					if (searchParams.maxPrice && !isNaN(searchParams.maxPrice)) {
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
			console.timeEnd('query_transactions');
			// return result;
			console.log(countResult, JSON.stringify(data, null, 2));
			return { count: countResult[0].count, data };
		} catch (error) {
			console.log('error', error);
			return {
				count: 0,
				data: []
			};
		}
	}
	return {
		transactions: getTransactions(page - 1, pageSize, searchParams)
	};
}
