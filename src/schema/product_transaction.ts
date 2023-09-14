import { products } from './products';
import { transactions } from './transactions';
import { integer, pgTable, primaryKey } from 'drizzle-orm/pg-core';

export const productsTransactions = pgTable(
	'products_transactions',
	{
		transactionId: integer('transaction_id')
			.notNull()
			.references(() => transactions.id),
		productId: integer('product_id')
			.notNull()
			.references(() => products.id),
		quantity: integer('quantity').notNull()
	},
	(t) => ({
		pk: primaryKey(t.transactionId, t.productId)
	})
);
