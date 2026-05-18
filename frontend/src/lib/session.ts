import { AuthResponse, UserResponse } from "@/lib/api";

const tokenKey = "doorknock.token";
const userKey = "doorknock.user";

export function saveSession(session: AuthResponse) {
  localStorage.setItem(tokenKey, session.token);
  localStorage.setItem(userKey, JSON.stringify(session.user));
}

export function saveUser(user: UserResponse) {
  localStorage.setItem(userKey, JSON.stringify(user));
}

export function getSession() {
  const token = localStorage.getItem(tokenKey);
  const user = localStorage.getItem(userKey);

  if (!token || !user) {
    return null;
  }

  return {
    token,
    user: JSON.parse(user) as UserResponse,
  };
}

export function clearSession() {
  localStorage.removeItem(tokenKey);
  localStorage.removeItem(userKey);
}
