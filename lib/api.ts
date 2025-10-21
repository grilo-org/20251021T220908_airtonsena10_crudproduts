import axios, { AxiosInstance, AxiosHeaders } from "axios";

const DEFAULT_BASE_URL = "https://api-teste-front-production.up.railway.app";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_BASE_URL;

export const api: AxiosInstance = axios.create({
  baseURL,
});

type PersistedAuthState = { state?: { token?: string } } | { token?: string } | null;

function getTokenFromStorage(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem("auth");
    if (!raw) return null;
    const parsed: PersistedAuthState = JSON.parse(raw);
    const tokenFromState = (parsed && "state" in parsed ? parsed.state?.token : undefined) ?? undefined;
    const tokenDirect = (parsed && "token" in parsed ? parsed.token : undefined) ?? undefined;
    return tokenFromState ?? tokenDirect ?? null;
  } catch {
    return null;
  }
}

api.interceptors.request.use((config) => {
  const token = getTokenFromStorage();
  if (token) {
    const value = `Bearer ${token}`;
    const headers = config.headers instanceof AxiosHeaders ? config.headers : new AxiosHeaders(config.headers);
    headers.set("Authorization", value);
    config.headers = headers;
  }
  return config;
});

export const endpoints = {
  register: process.env.NEXT_PUBLIC_AUTH_REGISTER_PATH || "/users",
  login: process.env.NEXT_PUBLIC_AUTH_LOGIN_PATH || "/auth/login",
  products: "/products",
  productById: (id: string) => `/products/${id}`,
  productThumbnail: (id: string) => `/products/thumbnail/${id}`,
};
