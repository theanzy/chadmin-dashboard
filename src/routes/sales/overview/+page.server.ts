import { db } from '$lib/db';
import { transactions } from '../../../schema/transactions';
import { eq, sql } from 'drizzle-orm';
import { products } from '../../../schema/products';
import { productsTransactions } from '../../../schema/product_transaction';
import { getMonthName } from '$lib/utils';

// select
// 	date_part('year', t.created_at) as transaction_year,
// 	SUM(p.price * pt.quantity) as total_revenue,
// 	SUM(pt.quantity) as total_units
// from transactions as t
// inner join
// 	products_transactions as pt on t.id = pt.transaction_id
// inner join products as p on p.id = pt.product_id
// group by transaction_year
// order by transaction_year asc;

export async function load() {
	async function getCumulativeSales(year: number) {
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
	return {
		cumulativeSales: getCumulativeSales(new Date().getUTCFullYear())
	};
}
