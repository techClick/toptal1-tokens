import { getCreateTokenFields } from '@/utils/formFields';

describe('getCreateTokenFields', () => {
  const mockSetUserId = jest.fn();
  const mockSetScopes = jest.fn();
  const mockSetExpiresInMinutes = jest.fn();
  const inputStyle = { marginRight: '10px', padding: '8px 12px', fontSize: '14px' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return an array of 3 fields', () => {
    const fields = getCreateTokenFields({
      userId: 'user123',
      setUserId: mockSetUserId,
      scopes: 'read,write',
      setScopes: mockSetScopes,
      expiresInMinutes: 60,
      setExpiresInMinutes: mockSetExpiresInMinutes,
      inputStyle,
    });

    expect(fields).toHaveLength(3);
  });

  it('should have correct keys for all fields', () => {
    const fields = getCreateTokenFields({
      userId: 'user123',
      setUserId: mockSetUserId,
      scopes: 'read,write',
      setScopes: mockSetScopes,
      expiresInMinutes: 60,
      setExpiresInMinutes: mockSetExpiresInMinutes,
      inputStyle,
    });

    expect(fields[0].key).toBe('userId');
    expect(fields[1].key).toBe('scopes');
    expect(fields[2].key).toBe('expiresInMinutes');
  });

  it('should have correct types for all fields', () => {
    const fields = getCreateTokenFields({
      userId: 'user123',
      setUserId: mockSetUserId,
      scopes: 'read,write',
      setScopes: mockSetScopes,
      expiresInMinutes: 60,
      setExpiresInMinutes: mockSetExpiresInMinutes,
      inputStyle,
    });

    expect(fields[0].type).toBe('text');
    expect(fields[1].type).toBe('text');
    expect(fields[2].type).toBe('number');
  });

  it('should have correct values', () => {
    const fields = getCreateTokenFields({
      userId: 'testUser',
      setUserId: mockSetUserId,
      scopes: 'read',
      setScopes: mockSetScopes,
      expiresInMinutes: 30,
      setExpiresInMinutes: mockSetExpiresInMinutes,
      inputStyle,
    });

    expect(fields[0].value).toBe('testUser');
    expect(fields[1].value).toBe('read');
    expect(fields[2].value).toBe(30);
  });

  it('should call setUserId when userId field onChange is triggered', () => {
    const fields = getCreateTokenFields({
      userId: 'user123',
      setUserId: mockSetUserId,
      scopes: 'read,write',
      setScopes: mockSetScopes,
      expiresInMinutes: 60,
      setExpiresInMinutes: mockSetExpiresInMinutes,
      inputStyle,
    });

    const mockEvent = { target: { value: 'newUser' } } as React.ChangeEvent<HTMLInputElement>;
    fields[0].onChange(mockEvent);

    expect(mockSetUserId).toHaveBeenCalledWith('newUser');
  });

  it('should call setScopes when scopes field onChange is triggered', () => {
    const fields = getCreateTokenFields({
      userId: 'user123',
      setUserId: mockSetUserId,
      scopes: 'read,write',
      setScopes: mockSetScopes,
      expiresInMinutes: 60,
      setExpiresInMinutes: mockSetExpiresInMinutes,
      inputStyle,
    });

    const mockEvent = { target: { value: 'read' } } as React.ChangeEvent<HTMLInputElement>;
    fields[1].onChange(mockEvent);

    expect(mockSetScopes).toHaveBeenCalledWith('read');
  });

  it('should call setExpiresInMinutes with number when expires field onChange is triggered', () => {
    const fields = getCreateTokenFields({
      userId: 'user123',
      setUserId: mockSetUserId,
      scopes: 'read,write',
      setScopes: mockSetScopes,
      expiresInMinutes: 60,
      setExpiresInMinutes: mockSetExpiresInMinutes,
      inputStyle,
    });

    const mockEvent = { target: { value: '120' } } as React.ChangeEvent<HTMLInputElement>;
    fields[2].onChange(mockEvent);

    expect(mockSetExpiresInMinutes).toHaveBeenCalledWith(120);
  });

  it('should apply custom width style to expiresInMinutes field', () => {
    const fields = getCreateTokenFields({
      userId: 'user123',
      setUserId: mockSetUserId,
      scopes: 'read,write',
      setScopes: mockSetScopes,
      expiresInMinutes: 60,
      setExpiresInMinutes: mockSetExpiresInMinutes,
      inputStyle,
    });

    expect(fields[2].style).toHaveProperty('width', '120px');
  });
});
