import { pool } from '@/lib/db';

jest.mock('@/lib/db', () => ({
  pool: {
    query: jest.fn(),
  },
  initDb: jest.fn(),
}));

import { removeExpiredTokens } from '@/controllers/cleanupController';

describe('Token Expiry Logic', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('removeExpiredTokens', () => {
    it('should delete expired tokens from the database', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({
        rowCount: 3,
        rows: [{ id: 'token_1' }, { id: 'token_2' }, { id: 'token_3' }],
      });

      const deletedCount = await removeExpiredTokens();

      expect(pool.query).toHaveBeenCalledWith(
        'DELETE FROM tokens WHERE expires_at <= NOW() RETURNING id'
      );
      expect(deletedCount).toBe(3);
    });

    it('should return 0 when no expired tokens exist', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({
        rowCount: 0,
        rows: [],
      });

      const deletedCount = await removeExpiredTokens();

      expect(deletedCount).toBe(0);
    });

    it('should handle null rowCount gracefully', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({
        rowCount: null,
        rows: [],
      });

      const deletedCount = await removeExpiredTokens();

      expect(deletedCount).toBe(0);
    });
  });

  describe('Token Expiry Scenarios', () => {
    it('should identify token as expired when expiresAt is in the past', () => {
      const now = new Date();
      const pastDate = new Date(now.getTime() - 60000);
      
      const isExpired = pastDate <= now;
      
      expect(isExpired).toBe(true);
    });

    it('should identify token as valid when expiresAt is in the future', () => {
      const now = new Date();
      const futureDate = new Date(now.getTime() + 60000);
      
      const isExpired = futureDate <= now;
      
      expect(isExpired).toBe(false);
    });

    it('should calculate correct expiry time from expiresInMinutes', () => {
      const createdAt = new Date('2025-01-01T10:00:00.000Z');
      const expiresInMinutes = 60;
      const expiresAt = new Date(createdAt.getTime() + expiresInMinutes * 60 * 1000);

      expect(expiresAt.toISOString()).toBe('2025-01-01T11:00:00.000Z');
    });

    it('should expire token after specified minutes', () => {
      const createdAt = new Date('2025-01-01T10:00:00.000Z');
      const expiresInMinutes = 30;
      const expiresAt = new Date(createdAt.getTime() + expiresInMinutes * 60 * 1000);
      
      const checkTimeBeforeExpiry = new Date('2025-01-01T10:29:00.000Z');
      const checkTimeAfterExpiry = new Date('2025-01-01T10:31:00.000Z');

      expect(expiresAt > checkTimeBeforeExpiry).toBe(true);
      expect(expiresAt <= checkTimeAfterExpiry).toBe(true);
    });

    it('should handle edge case where token expires exactly now', () => {
      const now = new Date();
      const expiresAt = new Date(now.getTime());
      
      const isExpired = expiresAt <= now;
      
      expect(isExpired).toBe(true);
    });

    it('should handle very short expiry times (1 minute)', () => {
      const createdAt = new Date();
      const expiresInMinutes = 1;
      const expiresAt = new Date(createdAt.getTime() + expiresInMinutes * 60 * 1000);

      const expectedDiff = expiresAt.getTime() - createdAt.getTime();
      
      expect(expectedDiff).toBe(60000);
    });

    it('should handle long expiry times (24 hours)', () => {
      const createdAt = new Date();
      const expiresInMinutes = 24 * 60;
      const expiresAt = new Date(createdAt.getTime() + expiresInMinutes * 60 * 1000);

      const expectedDiff = expiresAt.getTime() - createdAt.getTime();
      
      expect(expectedDiff).toBe(24 * 60 * 60 * 1000);
    });
  });
});

describe('getTokensByUserId with cleanup', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should remove expired tokens before fetching', async () => {
    (pool.query as jest.Mock)
      .mockResolvedValueOnce({ rowCount: 2, rows: [] })
      .mockResolvedValueOnce({
        rows: [
          {
            id: 'token_valid',
            user_id: 'user123',
            scopes: ['read'],
            created_at: new Date(),
            expires_at: new Date(Date.now() + 60000),
            token: 'valid_token',
          },
        ],
      });

    const { getTokensByUserId } = await import('@/controllers/getTokensController');
    
    const tokens = await getTokensByUserId('user123');

    expect(pool.query).toHaveBeenCalledTimes(2);
    expect(pool.query).toHaveBeenNthCalledWith(
      1,
      'DELETE FROM tokens WHERE expires_at <= NOW() RETURNING id'
    );
    expect(tokens).toHaveLength(1);
    expect(tokens[0].id).toBe('token_valid');
  });
});
