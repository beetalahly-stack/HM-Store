import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

// Do not throw while importing this module. Next.js can import API modules while
// rendering an error page; an import-time exception would make the API return
// HTML and the browser would then fail with "Unexpected token '<'" when parsing JSON.
const databaseUrl = process.env.DATABASE_URL?.trim();

const globalForDb = globalThis as typeof globalThis & {
  __hmPostgresqlPool?: Pool;
};

// The real connection is still required for database operations. When the env
// variable is missing, use a deliberately unreachable local URL so requests fail
// inside the route's try/catch and return JSON instead of crashing module load.
const connectionString = databaseUrl || "postgresql://missing:missing@127.0.0.1:9/missing";

export const pool =
  globalForDb.__hmPostgresqlPool ??
  new Pool({
    connectionString,
    connectionTimeoutMillis: 5000,
    max: 5,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__hmPostgresqlPool = pool;
}

export const db = drizzle(pool);

export function hasDatabaseUrl() {
  return Boolean(databaseUrl);
}
