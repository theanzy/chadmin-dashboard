import { db } from '$lib/db/index.js';
import { eq, ilike, sql } from 'drizzle-orm';
import { transactions } from '../../../schema/transactions.js';
import { users } from '../../../schema/users.js';
import { productsTransactions } from '../../../schema/product_transaction.js';
import { products } from '../../../schema/products.js';

export function load({ url }) {
	const pageStr = url.searchParams.get('page');
	const pageSizeStr = url.searchParams.get('pageSize');
	const page = pageStr ? parseInt(pageStr) : 1;
	const pageSize = pageSizeStr ? parseInt(pageSizeStr) : 10;

	const customerNameStr = url.searchParams.get('name');

	async function getCustomer(page: number, pageSize: number) {
		try {
			let query = db
				.select({
					id: users.id,
					email: users.email,
					name: users.name,
					city: users.city,
					country: users.country,
					totalSpent: sql<number>`sum(${products.price} * ${productsTransactions.quantity})::bigint`
				})
				.from(users)
				.innerJoin(transactions, eq(users.id, transactions.customerId))
				.innerJoin(productsTransactions, eq(productsTransactions.transactionId, transactions.id))
				.innerJoin(products, eq(products.id, productsTransactions.productId))
				.groupBy(users.id);
			if (customerNameStr?.length) {
				console.log(customerNameStr, 'ss');
				query = query.where(ilike(users.name, `%${customerNameStr.toLocaleLowerCase()}%`));
			}
			const count = await db
				.select({
					total: sql<number>`count(*)::integer`
				})
				.from(sql`${query} as cte`);
			const data = await query
				.offset(page * pageSize)
				.limit(pageSize)
				.orderBy(users.id);
			const result = data.map((d) => {
				const totalSpent = parseInt(d.totalSpent as unknown as string) / 100;
				return {
					...d,
					totalSpent
				};
			});
			console.log(data, count);
			return {
				count: count[0].total,
				data: result
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
		customers: getCustomer(page - 1, pageSize)
	};
}
