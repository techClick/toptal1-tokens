import { v4 as uuidv4 } from 'uuid';
import { pool, initDb } from '@/lib/db';
import { Token, CreateTokenRequest } from '@/types/token';

let dbInitialized = false;

async function ensureDb() {
  if (!dbInitialized) {
    await initDb();
    dbInitialized = true;
  }
}

export async function createToken(data: CreateTokenRequest): Promise<Token> {
  await ensureDb();
  
  const { userId, scopes, expiresInMinutes } = data;
  
  const id = 'token_' + uuidv4().substring(0, 8);
  const tokenValue = uuidv4();
  const createdAt = new Date();
  const expiresAt = new Date(createdAt.getTime() + expiresInMinutes * 60 * 1000);
  
  await pool.query(
    'INSERT INTO tokens (id, user_id, scopes, created_at, expires_at, token) VALUES ($1, $2, $3, $4, $5, $6)',
    [id, userId, scopes, createdAt, expiresAt, tokenValue]
  );
  
  return {
    id,
    userId,
    scopes,
    createdAt: createdAt.toISOString(),
    expiresAt: expiresAt.toISOString(),
    token: tokenValue,
  };
}
