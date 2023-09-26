import { db } from '$lib/db/index.js';
import { desc, eq, sql } from 'drizzle-orm';
import { transactions } from '../../schema/transactions.js';
import { users } from '../../schema/users.js';
import { productsTransactions } from '../../schema/product_transaction.js';
import { products } from '../../schema/products.js';

export async function load({ url }) {
	const pageStr = url.searchParams.get('page');
	const pageSizeStr = url.searchParams.get('pageSize');
	const page = pageStr ? parseInt(pageStr) : 1;
	const pageSize = pageSizeStr ? parseInt(pageSizeStr) : 10;

	async function getUsers(pageIndex: number, pageSize: number, year: number) {
		try {
			const query = db
				.select({
					userId: users.id,
					name: users.name,
					email: users.email,
					revenue: sql<number>`sum(${productsTransactions.quantity} * ${products.price})::bigint`
						.mapWith((v) => {
							return parseInt(v) / 100;
						})
						.as('revenue')
				})
				.from(users)
				.innerJoin(transactions, eq(transactions.affiliateId, users.id))
				.innerJoin(productsTransactions, eq(productsTransactions.transactionId, transactions.id))
				.innerJoin(products, eq(products.id, productsTransactions.productId))
				.groupBy(users.id)
				// .orderBy((a) => [a.revenue, a.date])
				.orderBy((a) => [desc(a.revenue)])
				.where(eq(sql<number>`date_part('year', ${transactions.createdAt})::int`, year));
			const affiliates = db.$with('affiliates').as(query);
			const data = await db
				.with(affiliates)
				.select()
				.from(affiliates)
				.limit(pageSize)
				.offset(pageIndex * pageSize);
			const count = await db
				.with(affiliates)
				.select({ count: sql<number>`count(${affiliates.userId})::bigint`.mapWith(Number) })
				.from(affiliates);
			console.log(data, count);
			return {
				data: data,
				count: count[0].count
			};
		} catch (error) {
			console.log('error', error);
			return {
				count: 0,
				data: []
			};
		}
	}
	return {
		users: getUsers(page - 1, pageSize, new Date().getUTCFullYear())
	};
}
