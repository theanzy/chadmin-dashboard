import { integer, timestamp, varchar } from 'drizzle-orm/pg-core';
import { mySchema } from './myschema';

export const users = mySchema.table('users', {
	id: integer('id').primaryKey(),
	name: varchar('name', { length: 256 }).notNull(),
	email: varchar('email', { length: 256 }).notNull(),
	city: varchar('city', { length: 256 }).notNull(),
	country: varchar('country', { length: 3 }).notNull(),
	role: varchar('role', { length: 128 }).notNull(),
	createdAt: timestamp('created_at').notNull()
});
