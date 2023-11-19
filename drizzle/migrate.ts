import { drizzle } from 'drizzle-orm/postgres-js/driver';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
const migrationClient = postgres('postgres://postgres:adminadmin@0.0.0.0:5432/db', { max: 1 });
const db = drizzle(migrationClient);
await migrate(db, { migrationsFolder: 'drizzle' });
