import axios, { type AxiosResponse } from 'axios';
import { Platform } from 'react-native';

import type { ApiResponse } from '../types';
import { toAppError } from '../utils/error';

type RuntimeProcess = {
  process?: {
    env?: Record<string, string | undefined>;
  };
};

function resolveBaseUrl() {
  const env = (globalThis as RuntimeProcess).process?.env ?? {};
  const rawBaseUrl = env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:3000';
  let normalized = rawBaseUrl.trim().replace(/\/+$/, '');

  if (Platform.OS === 'android') {
    normalized = normalized
      .replace('://localhost', '://10.0.2.2')
      .replace('://127.0.0.1', '://10.0.2.2');
  }

  return normalized;
}

let authToken: string | null = null;
let unauthorizedHandler: (() => void) | null = null;

export const API_BASE_URL = resolveBaseUrl();

export function setAuthToken(token: string | null) {
  authToken = token;
}

export function setUnauthorizedHandler(handler: (() => void) | null) {
  unauthorizedHandler = handler;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const normalizedError = toAppError(error);

    if (normalizedError.status === 401 && unauthorizedHandler) {
      unauthorizedHandler();
    }

    return Promise.reject(normalizedError);
  }
);

export function extractData<T>(response: AxiosResponse<ApiResponse<T> | T>) {
  const payload = response.data as ApiResponse<T> | T;

  if (
    payload &&
    typeof payload === 'object' &&
    'success' in payload &&
    'data' in payload
  ) {
    return (payload as ApiResponse<T>).data;
  }

  return payload as T;
}

export default api;
