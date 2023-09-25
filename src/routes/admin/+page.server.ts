import { db } from '$lib/db';
import { eq, sql } from 'drizzle-orm';
import { users } from '../../schema';

export async function load({ url }) {
	const pageStr = url.searchParams.get('page');
	const pageSizeStr = url.searchParams.get('pageSize');
	const page = pageStr ? parseInt(pageStr) : 1;
	const pageSize = pageSizeStr ? parseInt(pageSizeStr) : 10;
	async function getAdminUsers(pageIndex: number, pageSize: number) {
		try {
			const query = db
				.select({
					id: users.id,
					name: users.name,
					email: users.email,
					city: users.city,
					country: users.country
				})
				.from(users)
				.where(eq(users.role, 'admin'))
				.orderBy(users.id);

			const adminUsers = db.$with('tr').as(query);

			const data = await db
				.with(adminUsers)
				.select()
				.from(adminUsers)
				.limit(pageSize)
				.offset(pageIndex * pageSize);
			const count = await db
				.with(adminUsers)
				.select({
					count: sql<number>`count(${users.id})::int`
				})
				.from(adminUsers);
			return {
				data: data,
				count: count[0].count
			};
		} catch (error) {
			return {
				data: [],
				count: 0
			};
		}
	}
	return {
		admins: getAdminUsers(page - 1, pageSize)
	};
}
