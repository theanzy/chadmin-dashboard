import { db } from '$lib/db';
import { transactions } from '../../../schema/transactions';
import { and, eq, gte, lte, sql } from 'drizzle-orm';
import { products } from '../../../schema/products';
import { productsTransactions } from '../../../schema/product_transaction';

export async function load() {
	async function getDailySales(start: Date, end: Date) {
		const monthlySales = await db
			.select({
				date: transactions.createdAt,
				totalRevenue: sql<number>`sum(${products.price} * ${productsTransactions.quantity})::bigint`,
				totalUnits: sql<number>`sum(${productsTransactions.quantity})::bigint`
			})
			.from(transactions)
			.innerJoin(productsTransactions, eq(productsTransactions.transactionId, transactions.id))
			.innerJoin(products, eq(products.id, productsTransactions.productId))
			.where(and(gte(transactions.createdAt, start), lte(transactions.createdAt, end)))
			.groupBy(transactions.createdAt)
			.orderBy(transactions.createdAt);
		const result = monthlySales.map((sales) => {
			const date = sales.date;
			const totalRevenue = parseInt(sales.totalRevenue as unknown as string) / 100;
			const totalUnits = parseInt(sales.totalUnits as unknown as string);
			return { date, totalRevenue, totalUnits };
		});
		return result;
	}
	return {
		dailySales: getDailySales(new Date(Date.UTC(2023, 8, 1)), new Date())
	};
}
