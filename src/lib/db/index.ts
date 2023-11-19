import { DB_URL } from '$env/static/private';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../../schema';
// for migrations
// for query purposes

const dbUrl = DB_URL;
const queryClient = postgres(dbUrl);

export const db = drizzle(queryClient, { schema: schema });
