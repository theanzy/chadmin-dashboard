import { DB_URL } from '$env/static/private';
import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
// import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

// for migrations
// const migrationClient = postgres("postgres://postgres:adminadmin@0.0.0.0:5432/db", { max: 1 });
// migrate(drizzle(migrationClient), ...)

// for query purposes
const dbUrl = DB_URL;
const queryClient = postgres(dbUrl);
export const db: PostgresJsDatabase = drizzle(queryClient);