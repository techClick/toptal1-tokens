import { pool, initDb } from '@/lib/db';
import { Token } from '@/types/token';
import { removeExpiredTokens } from './cleanupController';

let dbInitialized = false;

async function ensureDb() {
  if (!dbInitialized) {
    await initDb();
    dbInitialized = true;
  }
}

export async function getTokensByUserId(userId: string): Promise<Token[]> {
  await ensureDb();
  
  await removeExpiredTokens();
  
  const result = await pool.query(
    'SELECT id, user_id, scopes, created_at, expires_at, token FROM tokens WHERE user_id = $1 AND expires_at > NOW()',
    [userId]
  );
  
  return result.rows.map(row => ({
    id: row.id,
    userId: row.user_id,
    scopes: row.scopes,
    createdAt: row.created_at.toISOString(),
    expiresAt: row.expires_at.toISOString(),
    token: row.token,
  }));
}
