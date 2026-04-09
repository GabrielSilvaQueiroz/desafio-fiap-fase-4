import axios from 'axios';

export interface AppError {
  status?: number;
  message: string;
  original?: unknown;
}

export function toAppError(error: unknown): AppError {
  if (typeof error === 'object' && error !== null && 'message' in error) {
    const candidate = error as AppError;
    if (typeof candidate.message === 'string' && ('status' in candidate || 'original' in candidate)) {
      return candidate;
    }
  }

  if (axios.isAxiosError(error)) {
    return {
      status: error.response?.status,
      message: error.response?.data?.message ?? error.message ?? 'Falha de comunicação com o serviço.',
      original: error,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      original: error,
    };
  }

  return {
    message: 'Ocorreu um erro inesperado.',
    original: error,
  };
}

export function getErrorMessage(error: unknown, fallback = 'Não foi possível concluir a ação.') {
  const appError = toAppError(error);
  return appError.message || fallback;
}
