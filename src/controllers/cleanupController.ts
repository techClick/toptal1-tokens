import { pool, initDb } from '@/lib/db';

let dbInitialized = false;

async function ensureDb() {
  if (!dbInitialized) {
    await initDb();
    dbInitialized = true;
  }
}

export async function removeExpiredTokens(): Promise<number> {
  await ensureDb();
  
  const result = await pool.query(
    'DELETE FROM tokens WHERE expires_at <= NOW() RETURNING id'
  );
  
  return result.rowCount ?? 0;
}
