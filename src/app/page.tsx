'use client';

import { useState } from 'react';
import { useTokens } from '@/hooks/useTokens';
import { getCreateTokenFields } from '@/utils/formFields';

export default function Home() {
  const [userId, setUserId] = useState('');
  const [scopes, setScopes] = useState('read,write');
  const [expiresInMinutes, setExpiresInMinutes] = useState(60);
  const [searchUserId, setSearchUserId] = useState('');

  const { tokens, message, createToken, listTokens } = useTokens({
    userId,
    scopes,
    expiresInMinutes,
    searchUserId,
  });

  const inputStyle = { marginRight: '10px', padding: '8px 12px', fontSize: '14px' };
  const buttonStyle = { padding: '8px 16px', fontSize: '14px' };

  const createTokenFields = getCreateTokenFields({
    userId,
    setUserId,
    scopes,
    setScopes,
    expiresInMinutes,
    setExpiresInMinutes,
    inputStyle,
  });

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Token Manager</h1>
      
      <h2>Create Token</h2>
      <div>
        {createTokenFields.map((field) => (
          <input
            key={field.key}
            type={field.type}
            placeholder={field.placeholder}
            value={field.value}
            onChange={field.onChange}
            style={field.style}
          />
        ))}
        <button onClick={createToken} style={buttonStyle}>Create</button>
      </div>

      <h2>List Tokens</h2>
      <div>
        <input
          type="text"
          placeholder="User ID"
          value={searchUserId}
          onChange={(e) => setSearchUserId(e.target.value)}
          style={inputStyle}
        />
        <button onClick={listTokens} style={buttonStyle}>List</button>
      </div>

      {message && <p>{message}</p>}

      {tokens.length > 0 && (
        <div>
          <h3>Tokens:</h3>
          <pre style={{ background: '#f0f0f0', padding: '10px' }}>
            {JSON.stringify(tokens, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
