import { relations } from 'drizzle-orm';
import { products } from './products';
import { transactions } from './transactions';
import { productsTransactions } from './product_transaction';

export const productRelations = relations(products, ({ many }) => ({
	productTransactions: many(productsTransactions)
}));

export const transactionRelations = relations(transactions, ({ many }) => ({
	transactionProducts: many(productsTransactions)
}));
