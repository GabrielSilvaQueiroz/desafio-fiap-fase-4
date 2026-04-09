import AsyncStorage from '@react-native-async-storage/async-storage';

import type { User } from '../types';

const TOKEN_KEY = '@desafio-fiap-fase-4/token';
const USER_KEY = '@desafio-fiap-fase-4/user';

export async function loadSession() {
  const [token, userRaw] = await Promise.all([
    AsyncStorage.getItem(TOKEN_KEY),
    AsyncStorage.getItem(USER_KEY),
  ]);

  if (!token || !userRaw) {
    return null;
  }

  try {
    const user = JSON.parse(userRaw) as User;
    return { token, user };
  } catch {
    await clearSession();
    return null;
  }
}

export async function saveSession(token: string, user: User) {
  await Promise.all([
    AsyncStorage.setItem(TOKEN_KEY, token),
    AsyncStorage.setItem(USER_KEY, JSON.stringify(user)),
  ]);
}

export async function clearSession() {
  await Promise.all([
    AsyncStorage.removeItem(TOKEN_KEY),
    AsyncStorage.removeItem(USER_KEY),
  ]);
}
