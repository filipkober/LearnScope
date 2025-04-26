/**
 * Authentication utility functions for handling JWT tokens
 */

// Key used for storing the token in localStorage
const AUTH_TOKEN_KEY = 'learn_scope_auth_token';

/**
 * Store authentication token in localStorage or sessionStorage
 * @param token - JWT token to store
 * @param rememberMe - If true, store in localStorage (persistent), otherwise in sessionStorage (session only)
 */
export function setAuthToken(token: string, rememberMe: boolean = false): void {
  if (typeof window === 'undefined') return; // Skip if not in browser environment
  
  if (rememberMe) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  } else {
    sessionStorage.setItem(AUTH_TOKEN_KEY, token);
  }
}

/**
 * Get the stored authentication token
 * @returns The JWT token or null if not found
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null; // Skip if not in browser environment
  
  // Check sessionStorage first, then localStorage
  const token = sessionStorage.getItem(AUTH_TOKEN_KEY) || localStorage.getItem(AUTH_TOKEN_KEY);
  return token;
}

/**
 * Remove the authentication token (logout)
 */
export function removeAuthToken(): void {
  if (typeof window === 'undefined') return; // Skip if not in browser environment
  
  sessionStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

/**
 * Check if user is authenticated
 * @returns boolean indicating if a token exists
 */
export function isAuthenticated(): boolean {
  return !!getAuthToken();
}