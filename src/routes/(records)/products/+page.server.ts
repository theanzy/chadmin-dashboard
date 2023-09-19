import { db } from '$lib/db';
import { and, eq, ilike, sql } from 'drizzle-orm';
import { products } from '../../../schema/products';
import { transactions } from '../../../schema/transactions';
import { productsTransactions } from '../../../schema/product_transaction';

export async function load({ url }) {
	const productName = url.searchParams.get('name');
	const pageStr = url.searchParams.get('page');
	const pageSizeStr = url.searchParams.get('pageSize');
	const page = pageStr ? parseInt(pageStr) : 1;
	const pageSize = pageSizeStr ? parseInt(pageSizeStr) : 10;

	async function getProducts(year: number) {
		try {
			const satisfyYear = eq(sql<number>`date_part('year', ${transactions.createdAt})`, year);

			let query = db
				.select({
					id: products.id,
					name: products.name,
					category: products.category,
					price: products.price,
					rating: products.rating,
					supply: products.supply,
					yearlyRevenue: sql<number>`sum(${products.price} * ${productsTransactions.quantity})::bigint`,
					yearlyUnitsSold: sql<number>`sum(${productsTransactions.quantity})::bigint`
				})
				.from(products)
				.innerJoin(productsTransactions, eq(productsTransactions.productId, products.id))
				.innerJoin(transactions, eq(productsTransactions.transactionId, transactions.id))
				.where(satisfyYear)
				.groupBy(products.id);
			if (productName?.length) {
				query = query.where(and(satisfyYear, ilike(products.name, `%${productName}%`)));
			}
			const count = await db
				.select({
					total: sql<number>`count(*)::integer`
				})
				.from(sql`${query} as cte`);
			const data = await query
				.offset(page * pageSize)
				.limit(pageSize)
				.orderBy(products.id);
			const result = data.map((d) => {
				d.yearlyUnitsSold = +d.yearlyUnitsSold;
				d.yearlyRevenue = +d.yearlyRevenue / 100;
				return d;
			});
			console.log(result);
			return {
				count: count[0].total,
				data: result
			};
		} catch (error) {
			console.log('error getting products');
			return {
				count: 0,
				data: []
			};
		}
	}

	return { products: getProducts(new Date().getUTCFullYear()) };
}
