import { getCumulativeSales, getSalesByCategory, getTransactions } from '$lib/server/query';
import { db } from '$lib/db';
import { and, desc, eq, inArray, or, sql } from 'drizzle-orm';
import { products, productsTransactions, transactions, users } from '../schema';
import { getMonthName } from '$lib/utils';

async function getTotalCustomers(year: number, month: number) {
	const data = await db
		.select({
			count: sql<number>`sum(${users.id})::int`,
			month: sql<number>`date_part('month', ${transactions.createdAt})`.mapWith((v) => {
				return getMonthName(v);
			}),
			year: sql`date_part('year', ${transactions.createdAt})`
		})
		.from(users)
		.innerJoin(transactions, eq(transactions.customerId, users.id))
		.groupBy(
			sql`date_part('year', ${transactions.createdAt})`,
			sql`date_part('month', ${transactions.createdAt})`
		)
		.orderBy(desc(sql`date_part('month', ${transactions.createdAt})`))
		.having(() => {
			const isJanuary = month - 1 === 0;
			const startMonth = isJanuary ? 12 : month - 1;
			const startYear = isJanuary ? year - 1 : year;

			return or(
				and(
					eq(sql`date_part('year', ${transactions.createdAt})`, startYear),
					eq(sql`date_part('month', ${transactions.createdAt})`, startMonth)
				),
				and(
					eq(sql`date_part('year', ${transactions.createdAt})`, year),
					eq(sql`date_part('month', ${transactions.createdAt})`, month)
				)
			);
		});
	const end = data[0].count;
	const start = data[1].count;
	const changePercentage = Math.round(((end - start) / end) * 100);
	return {
		totalCustomers: end,
		changePercentage
	};
}

async function topSalesPerson(year: number, month: number) {
	const salesQuery = db
		.select({
			affiliateId: users.id,
			name: users.name,
			salesMade:
				sql<number>`sum(${products.price} * ${productsTransactions.quantity} / 100)::integer`.as(
					'salesMade'
				)
		})
		.from(users)
		.innerJoin(transactions, eq(transactions.affiliateId, users.id))
		.innerJoin(productsTransactions, eq(transactions.id, productsTransactions.transactionId))
		.innerJoin(products, eq(products.id, productsTransactions.productId))
		.groupBy(users.id)
		.where(
			and(
				eq(sql`date_part('year', ${transactions.createdAt})`, year),
				eq(sql`date_part('month', ${transactions.createdAt})`, month)
			)
		);

	const sales = db.$with('sales').as(salesQuery);
	const maxSalesQuery = db
		.with(sales)
		.select({
			total: sql`max(${sales.salesMade})`.as('total')
		})
		.from(sales);
	const topSales = await db
		.with(sales)
		.select({ name: sales.name, salesMade: sales.salesMade })
		.from(sales)
		.where(inArray(sales.salesMade, maxSalesQuery));
	return topSales[0];
}

async function monthlySales(year: number, month: number) {
	const salesQuery = db
		.select({
			year: sql`date_part('year', ${transactions.createdAt})`,
			month: sql`date_part('month', ${transactions.createdAt})`,
			salesMade:
				sql<number>`sum(${products.price} * ${productsTransactions.quantity} / 100)::integer`.as(
					'salesMade'
				)
		})
		.from(users)
		.innerJoin(transactions, eq(transactions.affiliateId, users.id))
		.innerJoin(productsTransactions, eq(transactions.id, productsTransactions.transactionId))
		.innerJoin(products, eq(products.id, productsTransactions.productId))
		.groupBy(
			sql`date_part('month', ${transactions.createdAt})`,
			sql`date_part('year', ${transactions.createdAt})`
		)
		.having(() => {
			const isJanuary = month - 1 === 0;
			const startMonth = isJanuary ? 12 : month - 1;
			const startYear = isJanuary ? year - 1 : year;
			return or(
				and(
					eq(sql`date_part('year', ${transactions.createdAt})`, startYear),
					eq(sql`date_part('month', ${transactions.createdAt})`, startMonth)
				),
				and(
					eq(sql`date_part('year', ${transactions.createdAt})`, year),
					eq(sql`date_part('month', ${transactions.createdAt})`, month)
				)
			);
		})
		.orderBy(desc(sql`date_part('month', ${transactions.createdAt})`));
	const data = await salesQuery;
	const end = data[0].salesMade;
	const start = data[1].salesMade;
	const changePercentage = Math.round(((end - start) / end) * 100);
	return {
		salesMade: end,
		changePercentage
	};
}

async function topSalesCountry(year: number, month: number, topo: Record<string, string>) {
	const salesQuery = db
		.select({
			country: users.country,
			salesMade:
				sql<number>`sum(${products.price} * ${productsTransactions.quantity} / 100)::integer`.as(
					'salesMade'
				)
		})
		.from(users)
		.innerJoin(transactions, eq(transactions.customerId, users.id))
		.innerJoin(productsTransactions, eq(transactions.id, productsTransactions.transactionId))
		.innerJoin(products, eq(products.id, productsTransactions.productId))
		.groupBy(users.country)
		.where(
			and(
				eq(sql`date_part('year', ${transactions.createdAt})`, year),
				eq(sql`date_part('month', ${transactions.createdAt})`, month)
			)
		);

	const sales = db.$with('sales').as(salesQuery);
	const maxSalesQuery = db
		.with(sales)
		.select({
			total: sql`max(${sales.salesMade})`.as('total')
		})
		.from(sales);
	const topSales = await db
		.with(sales)
		.select({ country: sales.country, salesMade: sales.salesMade })
		.from(sales)
		.where(inArray(sales.salesMade, maxSalesQuery));
	const result = {
		country: topo[topSales[0].country],
		revenue: topSales[0].salesMade
	};
	return result;
}

export async function load({ fetch }) {
	const topo = await fetch(
		'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson'
	)
		.then((res) => res.json())
		.then((topo) =>
			topo.features.reduce((acc: Record<string, string>, f: any) => {
				acc[f.id] = f.properties.name;
				return acc;
			}, {} as Record<string, string>)
		);
	const today = new Date();
	const year = today.getUTCFullYear();
	const month = today.getUTCMonth() + 1;
	return {
		customers: getTotalCustomers(year, month),
		topSales: topSalesPerson(year, month),
		monthlySales: monthlySales(year, month),
		topSalesCountry: topSalesCountry(year, month, topo),
		cumulativeSales: getCumulativeSales(year),
		breakdown: getSalesByCategory(year),
		transactions: getTransactions(0, 10)
	};
}
