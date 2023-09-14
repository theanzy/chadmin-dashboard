import dotenv from 'dotenv';
import type { Config } from 'drizzle-kit';

dotenv.config();
export default {
	schema: './src/schema/*',
	driver: 'pg',
	dbCredentials: {
		connectionString: process.env.DB_URL as string
	},
	out: './drizzle'
} satisfies Config;
