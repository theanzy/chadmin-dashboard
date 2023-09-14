import { integer, pgTable, smallint, varchar } from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
	id: integer('id').primaryKey(),
	name: varchar('name', { length: 256 }).notNull(),
	price: integer('price').notNull(),
	description: varchar('description', { length: 1024 }).notNull(),
	category: varchar('category', { length: 128 }).notNull(),
	rating: smallint('rating').notNull(), // 1 to 10
	supply: integer('supply').notNull()
});
