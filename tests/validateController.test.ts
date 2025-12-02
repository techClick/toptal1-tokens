import { validateCreateRequest, validateGetRequest } from '@/controllers/validateController';

describe('validateCreateRequest', () => {
  it('should return valid for correct input', () => {
    const result = validateCreateRequest({
      userId: 'user123',
      scopes: ['read', 'write'],
      expiresInMinutes: 60,
    });
    
    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.data.userId).toBe('user123');
      expect(result.data.scopes).toEqual(['read', 'write']);
      expect(result.data.expiresInMinutes).toBe(60);
    }
  });

  it('should reject null body', () => {
    const result = validateCreateRequest(null);
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.error).toBe('Request body must be an object');
    }
  });

  it('should reject empty userId', () => {
    const result = validateCreateRequest({
      userId: '',
      scopes: ['read'],
      expiresInMinutes: 60,
    });
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.error).toBe('userId must be a non-empty string');
    }
  });

  it('should reject empty scopes array', () => {
    const result = validateCreateRequest({
      userId: 'user123',
      scopes: [],
      expiresInMinutes: 60,
    });
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.error).toBe('scopes must be a non-empty array of strings');
    }
  });

  it('should reject invalid scopes', () => {
    const result = validateCreateRequest({
      userId: 'user123',
      scopes: ['read', 'delete'],
      expiresInMinutes: 60,
    });
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.error).toBe('scopes must only contain "read" or "write"');
    }
  });

  it('should reject negative expiresInMinutes', () => {
    const result = validateCreateRequest({
      userId: 'user123',
      scopes: ['read'],
      expiresInMinutes: -10,
    });
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.error).toBe('expiresInMinutes must be a positive integer');
    }
  });

  it('should reject non-integer expiresInMinutes', () => {
    const result = validateCreateRequest({
      userId: 'user123',
      scopes: ['read'],
      expiresInMinutes: 10.5,
    });
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.error).toBe('expiresInMinutes must be a positive integer');
    }
  });
});

describe('validateGetRequest', () => {
  it('should return valid for non-empty userId', () => {
    const result = validateGetRequest('user123');
    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.userId).toBe('user123');
    }
  });

  it('should reject null userId', () => {
    const result = validateGetRequest(null);
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.error).toBe('userId query parameter is required');
    }
  });

  it('should reject empty userId', () => {
    const result = validateGetRequest('');
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.error).toBe('userId query parameter is required');
    }
  });

  it('should reject whitespace-only userId', () => {
    const result = validateGetRequest('   ');
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.error).toBe('userId query parameter is required');
    }
  });
});
