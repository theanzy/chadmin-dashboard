import { db } from '$lib/db';
import { transactions } from '../../../schema/transactions';
import { and, eq, gte, lte, sql } from 'drizzle-orm';
import { products } from '../../../schema/products';
import { productsTransactions } from '../../../schema/product_transaction';
import { getStartOfMonth } from '$lib/utils';

export async function load({ url }) {
	const startDateStr = url.searchParams.get('startdate');
	const endDateStr = url.searchParams.get('enddate');

	let startDate = getStartOfMonth(new Date());
	if (startDateStr) {
		const parsed = new Date(startDateStr);
		if (!isNaN(parsed.getTime())) {
			startDate = parsed;
		}
	}
	console.log('endStr', endDateStr);
	let endDate = new Date();
	if (endDateStr) {
		const parsed = new Date(endDateStr);
		console.log('parsed', parsed);

		if (!isNaN(parsed.getTime())) {
			endDate = parsed;
		}
	}

	async function getDailySales(start: Date, end: Date) {
		console.log('sss', start, end);

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
		dailySales: getDailySales(startDate, endDate)
	};
}
