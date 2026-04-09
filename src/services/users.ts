import api, { extractData } from './api';

import type { PaginatedResponse, User, UserRole } from '../types';

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface UpdateUserPayload {
  name: string;
  email: string;
  role: UserRole;
  password?: string;
}

export interface ListUsersParams {
  page?: number;
  limit?: number;
  role?: UserRole;
  search?: string;
}

export async function listUsers(params: ListUsersParams = {}) {
  const query = new URLSearchParams();

  if (typeof params.page === 'number') {
    query.set('page', String(params.page));
  }

  if (typeof params.limit === 'number') {
    query.set('limit', String(params.limit));
  }

  if (params.role) {
    query.set('role', params.role);
  }

  if (params.search?.trim()) {
    query.set('search', params.search.trim());
  }

  const searchParams = query.toString();
  const response = await api.get(searchParams ? `/users?${searchParams}` : '/users');

  return extractData<PaginatedResponse<User>>(response);
}

export async function getUserById(userId: string) {
  const response = await api.get(`/users/${userId}`);
  return extractData<User>(response);
}

export async function createUser(payload: CreateUserPayload) {
  const response = await api.post('/users', payload);
  return extractData<User>(response);
}

export async function updateUser(userId: string, payload: UpdateUserPayload) {
  const response = await api.put(`/users/${userId}`, payload);
  return extractData<User>(response);
}

export async function deleteUser(userId: string) {
  const response = await api.delete(`/users/${userId}`);
  return extractData<User>(response);
}
