import { useState } from 'react';
import { Token } from '@/types/token';

interface UseTokensParams {
  userId: string;
  scopes: string;
  expiresInMinutes: number;
  searchUserId: string;
}

interface UseTokensReturn {
  tokens: Token[];
  message: string;
  createToken: () => Promise<void>;
  listTokens: () => Promise<void>;
  setMessage: (message: string) => void;
  setTokens: (tokens: Token[]) => void;
}

export function useTokens({ userId, scopes, expiresInMinutes, searchUserId }: UseTokensParams): UseTokensReturn {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [message, setMessage] = useState('');

  async function createToken() {
    const scopesList = scopes.split(',').map(s => s.trim()).filter(s => s !== '');
    
    if (!userId.trim()) {
      setMessage('Error: User ID is required');
      return;
    }
    if (scopesList.length === 0) {
      setMessage('Error: Scopes must be a non-empty array of strings');
      return;
    }
    if (expiresInMinutes <= 0) {
      setMessage('Error: Expires in minutes must be a positive number');
      return;
    }

    try {
      const res = await fetch('/api/tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          scopes: scopesList,
          expiresInMinutes,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Token created: ' + data.token);
      } else {
        setMessage('Error: ' + data.error);
      }
    } catch (err) {
      console.log(err)
      setMessage('Error creating token');
    }
  }

  async function listTokens() {
    try {
      const res = await fetch(`/api/tokens?userId=${searchUserId}`);
      const data = await res.json();
      if (res.ok) {
        setTokens(data);
        setMessage(`Found ${data.length} token(s)`);
      } else {
        setMessage('Error: ' + data.error);
      }
    } catch (err) {
      console.log(err)
      setMessage('Error fetching tokens');
    }
  }

  return {
    tokens,
    message,
    createToken,
    listTokens,
    setMessage,
    setTokens,
  };
}
