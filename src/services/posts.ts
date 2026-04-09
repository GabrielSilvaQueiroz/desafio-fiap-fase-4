import api, { extractData } from './api';

import type { Post } from '../types';

export interface PostPayload {
  title: string;
  content: string;
}

export async function listPosts(query = '') {
  const path = query.trim()
    ? `/posts/search?q=${encodeURIComponent(query.trim())}`
    : '/posts';

  const response = await api.get(path);
  return extractData<Post[]>(response) ?? [];
}

export async function getPostById(postId: string) {
  const response = await api.get(`/posts/${postId}`);
  return extractData<Post>(response);
}

export async function createPost(payload: PostPayload) {
  const response = await api.post('/posts', payload);
  return extractData<Post>(response);
}

export async function updatePost(postId: string, payload: PostPayload) {
  const response = await api.put(`/posts/${postId}`, payload);
  return extractData<Post>(response);
}

export async function deletePost(postId: string) {
  const response = await api.delete(`/posts/${postId}`);
  return extractData<Post>(response);
}
