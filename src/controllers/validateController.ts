import { CreateTokenRequest } from '@/types/token';

const VALID_SCOPES = ['read', 'write'];

export function validateCreateRequest(body: unknown): { valid: true; data: CreateTokenRequest } | { valid: false; error: string } {
  if (typeof body !== 'object' || body === null) {
    return { valid: false, error: 'Request body must be an object' };
  }
  
  const { userId, scopes, expiresInMinutes } = body as CreateTokenRequest;
  
  if (typeof userId !== 'string' || userId.trim() === '') {
    return { valid: false, error: 'userId must be a non-empty string' };
  }
  
  if (!Array.isArray(scopes) || scopes.length === 0 || !scopes.every(s => typeof s === 'string')) {
    return { valid: false, error: 'scopes must be a non-empty array of strings' };
  }
  
  if (!scopes.every(s => VALID_SCOPES.includes(s))) {
    return { valid: false, error: 'scopes must only contain "read" or "write"' };
  }
  
  if (typeof expiresInMinutes !== 'number' || !Number.isInteger(expiresInMinutes) || expiresInMinutes <= 0) {
    return { valid: false, error: 'expiresInMinutes must be a positive integer' };
  }
  
  return { valid: true, data: { userId, scopes, expiresInMinutes } };
}

export function validateGetRequest(userId: string | null): { valid: true; userId: string } | { valid: false; error: string } {
  if (!userId || userId.trim() === '') {
    return { valid: false, error: 'userId query parameter is required' };
  }
  return { valid: true, userId };
}
