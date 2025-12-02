import React from 'react';

export interface FormField {
  key: string;
  type: string;
  placeholder: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  style: React.CSSProperties;
}

interface CreateTokenFieldsParams {
  userId: string;
  setUserId: (value: string) => void;
  scopes: string;
  setScopes: (value: string) => void;
  expiresInMinutes: number;
  setExpiresInMinutes: (value: number) => void;
  inputStyle: React.CSSProperties;
}

export function getCreateTokenFields({
  userId,
  setUserId,
  scopes,
  setScopes,
  expiresInMinutes,
  setExpiresInMinutes,
  inputStyle,
}: CreateTokenFieldsParams): FormField[] {
  return [
    {
      key: 'userId',
      type: 'text',
      placeholder: 'User ID',
      value: userId,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setUserId(e.target.value),
      style: inputStyle,
    },
    {
      key: 'scopes',
      type: 'text',
      placeholder: 'Scopes (comma-separated)',
      value: scopes,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setScopes(e.target.value),
      style: inputStyle,
    },
    {
      key: 'expiresInMinutes',
      type: 'number',
      placeholder: 'Expires in minutes',
      value: expiresInMinutes,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setExpiresInMinutes(Number(e.target.value)),
      style: { ...inputStyle, width: '120px' },
    },
  ];
}
