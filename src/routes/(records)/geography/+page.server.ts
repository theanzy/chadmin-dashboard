import { db } from '$lib/db/index.js';
import { eq, sql } from 'drizzle-orm';
import { users } from '../../../schema/users.js';

export async function load() {
	const data = await db
		.select({
			value: sql<number>`count(${users.country})::int`,
			code: users.country
		})
		.from(users)
		.where(eq(users.role, 'user'))
		.groupBy(users.country);
	return {
		customers: data
	};
}
