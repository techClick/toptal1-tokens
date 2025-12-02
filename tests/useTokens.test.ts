import { renderHook, act } from '@testing-library/react';
import { useTokens } from '@/hooks/useTokens';

global.fetch = jest.fn();

describe('useTokens', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createToken', () => {
    it('should set error message when userId is empty', async () => {
      const { result } = renderHook(() =>
        useTokens({
          userId: '',
          scopes: 'read,write',
          expiresInMinutes: 60,
          searchUserId: '',
        })
      );

      await act(async () => {
        await result.current.createToken();
      });

      expect(result.current.message).toBe('Error: User ID is required');
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should set error message when scopes is empty', async () => {
      const { result } = renderHook(() =>
        useTokens({
          userId: 'user123',
          scopes: '',
          expiresInMinutes: 60,
          searchUserId: '',
        })
      );

      await act(async () => {
        await result.current.createToken();
      });

      expect(result.current.message).toBe('Error: Scopes must be a non-empty array of strings');
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should set error message when expiresInMinutes is not positive', async () => {
      const { result } = renderHook(() =>
        useTokens({
          userId: 'user123',
          scopes: 'read',
          expiresInMinutes: 0,
          searchUserId: '',
        })
      );

      await act(async () => {
        await result.current.createToken();
      });

      expect(result.current.message).toBe('Error: Expires in minutes must be a positive number');
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should call fetch and set success message on successful token creation', async () => {
      const mockToken = {
        id: 'token_123',
        userId: 'user123',
        scopes: ['read'],
        createdAt: '2025-01-01T00:00:00.000Z',
        expiresAt: '2025-01-01T01:00:00.000Z',
        token: 'abc123',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockToken,
      });

      const { result } = renderHook(() =>
        useTokens({
          userId: 'user123',
          scopes: 'read',
          expiresInMinutes: 60,
          searchUserId: '',
        })
      );

      await act(async () => {
        await result.current.createToken();
      });

      expect(global.fetch).toHaveBeenCalledWith('/api/tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'user123',
          scopes: ['read'],
          expiresInMinutes: 60,
        }),
      });
      expect(result.current.message).toBe('Token created: abc123');
    });

    it('should set error message on API error', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Invalid request' }),
      });

      const { result } = renderHook(() =>
        useTokens({
          userId: 'user123',
          scopes: 'read',
          expiresInMinutes: 60,
          searchUserId: '',
        })
      );

      await act(async () => {
        await result.current.createToken();
      });

      expect(result.current.message).toBe('Error: Invalid request');
    });
  });

  describe('listTokens', () => {
    it('should call fetch and set tokens on success', async () => {
      const mockTokens = [
        {
          id: 'token_123',
          userId: 'user123',
          scopes: ['read'],
          createdAt: '2025-01-01T00:00:00.000Z',
          expiresAt: '2025-01-01T01:00:00.000Z',
          token: 'abc123',
        },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockTokens,
      });

      const { result } = renderHook(() =>
        useTokens({
          userId: '',
          scopes: 'read',
          expiresInMinutes: 60,
          searchUserId: 'user123',
        })
      );

      await act(async () => {
        await result.current.listTokens();
      });

      expect(global.fetch).toHaveBeenCalledWith('/api/tokens?userId=user123');
      expect(result.current.tokens).toEqual(mockTokens);
      expect(result.current.message).toBe('Found 1 token(s)');
    });

    it('should set error message on API error', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'User not found' }),
      });

      const { result } = renderHook(() =>
        useTokens({
          userId: '',
          scopes: 'read',
          expiresInMinutes: 60,
          searchUserId: 'user123',
        })
      );

      await act(async () => {
        await result.current.listTokens();
      });

      expect(result.current.message).toBe('Error: User not found');
    });

    it('should handle fetch exception', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() =>
        useTokens({
          userId: '',
          scopes: 'read',
          expiresInMinutes: 60,
          searchUserId: 'user123',
        })
      );

      await act(async () => {
        await result.current.listTokens();
      });

      expect(result.current.message).toBe('Error fetching tokens');
    });
  });
});
