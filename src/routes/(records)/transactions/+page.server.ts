import { db } from '$lib/db';
import { aliasedTable, and, eq, sql } from 'drizzle-orm';
import { products, productsTransactions, transactions, users } from '../../../schema';

export async function load({ url }) {
	const pageStr = url.searchParams.get('page');
	const pageSizeStr = url.searchParams.get('pageSize');
	const page = pageStr ? parseInt(pageStr) : 1;
	const pageSize = pageSizeStr ? parseInt(pageSizeStr) : 10;

	async function getTransactions(pageIndex: number, pageSize: number) {
		try {
			console.time('query_transactions');

			const customers = aliasedTable(users, 'customers');
			const affiliates = aliasedTable(users, 'affiliates');
			const trQuery = db
				.select({
					transactionId: transactions.id,
					customerName: sql`${customers.name}`.as('customerName'),
					affiliateName: sql`${affiliates.name}`.as('affiliateName'),
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
				.innerJoin(affiliates, and(eq(affiliates.id, transactions.affiliateId)));

			const transactionRecords = db.$with('tr').as(trQuery);

			const query = db
				.with(transactionRecords)
				.select({
					transactionId: transactionRecords.transactionId,
					amount: sql`sum(${transactionRecords.price} * ${transactionRecords.quantity})`
						.mapWith((v) => {
							return Number(v) / 100;
						})
						.as('amount'),
					customer: sql`array_agg(${transactionRecords.customerName})`
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
				.groupBy(transactionRecords.transactionId, transactionRecords.createdAt);

			const aggregateQuery = db.$with('aggregate_query').as(query);

			const countResult = await db
				.with(aggregateQuery)
				.select({ count: sql<number>`count(${aggregateQuery.transactionId})` })
				.from(aggregateQuery);

			const data = await db
				.with(aggregateQuery)
				.select()
				.from(aggregateQuery)
				.offset(pageIndex * pageSize)
				.limit(pageSize)
				.orderBy(aggregateQuery.createdAt, aggregateQuery.transactionId);
			console.timeEnd('query_transactions');
			// return result;
			console.log(JSON.stringify(data, null, 2));
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
		transactions: getTransactions(page - 1, pageSize)
	};
}
