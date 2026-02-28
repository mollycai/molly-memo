export interface User {
  id: number;
  email: string;
  name?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginParams {
  email: string;
  password: string;
}

export interface RegisterParams {
  email: string;
  password: string;
  code: string;
  name?: string;
}

export interface SendCodeParams {
  email: string;
}

async function fetcher<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error("请求失败");
  }

  return data as T;
}

export const authApi = {
  sendCode: async (params: SendCodeParams) => {
    return fetcher<{ message: string }>("/api/auth/send-code", {
      method: "POST",
      body: JSON.stringify(params),
    });
  },

  login: async (params: LoginParams) => {
    return fetcher<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(params),
    });
  },

  register: async (params: RegisterParams) => {
    return fetcher<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(params),
    });
  },

  logout: async () => {
    return fetcher<{ message: string }>("/api/auth/logout", {
      method: "POST",
    });
  },
};
