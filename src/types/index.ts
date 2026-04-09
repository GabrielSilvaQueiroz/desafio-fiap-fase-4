export type UserRole = 'student' | 'teacher';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  createAt?: string;
  updateAt?: string;
}

export interface Post {
  _id: string;
  title: string;
  content: string;
  author_name: string;
  author_id: string;
  createAt?: string;
  updateAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationMeta;
  filters?: {
    role?: UserRole | null;
    search?: string | null;
  };
}

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  PostDetail: { postId: string };
  PostForm: { mode: 'create' | 'edit'; postId?: string };
  AdminHome: undefined;
  UsersList: { role: UserRole };
  UserForm: { mode: 'create' | 'edit'; role: UserRole; userId?: string };
};
