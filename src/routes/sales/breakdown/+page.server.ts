import { db } from '$lib/db';
import { transactions } from '../../../schema/transactions';
import { desc, eq, sql } from 'drizzle-orm';
import { products } from '../../../schema/products';
import { productsTransactions } from '../../../schema/product_transaction';

export async function load() {
	async function getSalesByCategory(year: number) {
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
	return {
		sales: getSalesByCategory(new Date().getUTCFullYear())
	};
}
