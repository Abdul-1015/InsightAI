import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { DATABASE_URL } from 'astro:env/server';
import * as schema from './schema';

const connectionString = DATABASE_URL;

if (!connectionString) {
  console.warn('[db] DATABASE_URL is not configured. Database features disabled until it is set.');
}

let _client: postgres.Sql | null = null;
let _db: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (!_db) {
    if (!connectionString) {
      throw new Error('DATABASE_URL is not defined');
    }
    _client = postgres(connectionString, {
      max: 10,
      idle_timeout: 30,
    });
    _db = drizzle(_client, { schema });
  }
  return _db;
}

export async function verifyConnection() {
  if (!connectionString) {
    throw new Error('DATABASE_URL is not defined');
  }
  const client = postgres(connectionString, { max: 1 });
  try {
    await client`SELECT 1`;
    return true;
  } finally {
    await client.end();
  }
}
