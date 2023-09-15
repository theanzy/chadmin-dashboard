import { db } from '$lib/db';
import { transactions } from '../../../schema/transactions';
import { eq, sql } from 'drizzle-orm';
import { products } from '../../../schema/products';
import { productsTransactions } from '../../../schema/product_transaction';
import { getMonthName } from '$lib/utils';

export async function load() {
	async function getMonthlySales(year: number) {
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
		const result = monthlySales.map((sales) => {
			const month = getMonthName(sales.month);
			const totalRevenue = parseInt(sales.totalRevenue as unknown as string) / 100;
			const totalUnits = parseInt(sales.totalUnits as unknown as string);
			return { month, totalRevenue, totalUnits };
		});
		return result;
	}
	return {
		monthlySales: getMonthlySales(new Date().getUTCFullYear())
	};
}
