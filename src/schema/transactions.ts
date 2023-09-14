import { integer, pgTable, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users';

export const transactions = pgTable('transactions', {
	id: integer('id').primaryKey().notNull(),
	affiliateId: integer('affiliate_id')
		.references(() => users.id)
		.notNull(),
	customerId: integer('customer_id')
		.references(() => users.id)
		.notNull(),
	createdAt: timestamp('created_at').notNull()
});
