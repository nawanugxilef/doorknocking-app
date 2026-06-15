export type UserRole = "ADMIN" | "VOLUNTEER_COORDINATOR" | "DOORKNOCKER";

export type UserResponse = {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  address: string | null;
  role: UserRole;
};

export type AuthResponse = {
  token: string;
  user: UserResponse;
};

export type RegisterResponse = {
  email: string;
  message: string;
};

export type VerifyEmailResponse = {
  email: string;
  message: string;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

export async function apiRequest<T>(
  path: string,
  options: RequestInit & { token?: string } = {}
): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  if (options.token) {
    headers.set("Authorization", `Bearer ${options.token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const fallback = `Request failed with status ${response.status}`;
    let message = fallback;

    try {
      const body = await response.json();
      message = body.message ?? body.error ?? fallback;
    } catch {
      message = fallback;
    }

    throw new Error(message);
  }

  return response.json();
}
