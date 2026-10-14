// Typed API client for GAMEPULSE Backend

export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api/v1'
).replace(/\/$/, '');

export class ApiError extends Error {
  code: string;
  statusCode: number;
  details?: any;

  constructor(message: string, statusCode = 500, code = 'INTERNAL_ERROR', details?: any) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

let storedToken: string | null = null;

export function setAuthToken(token: string | null) {
  storedToken = token;
  if (token) {
    try {
      localStorage.setItem('gp_admin_token', token);
    } catch {
      // ignore
    }
  } else {
    try {
      localStorage.removeItem('gp_admin_token');
    } catch {
      // ignore
    }
  }
}

export function getAuthToken(): string | null {
  if (storedToken) return storedToken;
  try {
    storedToken = localStorage.getItem('gp_admin_token');
  } catch {
    storedToken = null;
  }
  return storedToken;
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const token = getAuthToken();
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include', // Includes HttpOnly cookies
  });

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  let body: any;
  try {
    body = await response.json();
  } catch {
    throw new ApiError('Failed to parse server response', response.status, 'PARSE_ERROR');
  }

  if (!response.ok || body.success === false) {
    throw new ApiError(
      body.message || `Request failed with status ${response.status}`,
      response.status,
      body.code || 'REQUEST_FAILED',
      body.details
    );
  }

  return body.data !== undefined ? body.data : body;
}

export const api = {
  get: <T>(endpoint: string, options?: RequestInit) =>
    apiRequest<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, data?: any, options?: RequestInit) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data instanceof FormData ? data : JSON.stringify(data),
    }),

  patch: <T>(endpoint: string, data?: any, options?: RequestInit) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: <T>(endpoint: string, options?: RequestInit) =>
    apiRequest<T>(endpoint, { ...options, method: 'DELETE' }),
};
