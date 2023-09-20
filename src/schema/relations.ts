import { relations } from 'drizzle-orm';
import { products } from './products';
import { transactions } from './transactions';
import { productsTransactions } from './product_transaction';
import { users } from './users';

export const productRelations = relations(products, ({ many }) => ({
	productTransactions: many(productsTransactions)
}));

export const transactionRelations = relations(transactions, ({ many, one }) => ({
	transactionProducts: many(productsTransactions),
	customer: one(users, {
		fields: [transactions.customerId],
		references: [users.id]
	}),
	affiliate: one(users, { fields: [transactions.affiliateId], references: [users.id] })
}));

export const productsTransactionsRelations = relations(productsTransactions, ({ one }) => ({
	product: one(products, {
		fields: [productsTransactions.productId],
		references: [products.id]
	}),
	transaction: one(transactions, {
		fields: [productsTransactions.transactionId],
		references: [transactions.id]
	})
}));
