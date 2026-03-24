export type AuthUser = {
  name: string;
  role: 'citizen' | 'collector' | 'facility' | 'authority';
};

const STORAGE_KEY = 'tb_user';

export function setUser(user: AuthUser) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export function getUser(): AuthUser | null {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : null;
}

export function logout() {
  localStorage.removeItem(STORAGE_KEY);
}