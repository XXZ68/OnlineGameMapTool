import axios from "axios";

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  params?: Record<string, unknown>;
  body?: unknown;
  headers?: HeadersInit;
  signal?: AbortSignal;
};

export const customInstance = async <T>(
  url: string,
  options?: RequestOptions,
): Promise<T> => {
  const response = await axios<T>({
    baseURL: import.meta.env.VITE_API_URL,
    url,
    method: options?.method,
    params: options?.params,
    data: options?.body,
    headers: options?.headers
      ? Object.fromEntries(new Headers(options.headers).entries())
      : undefined,
    signal: options?.signal,
  });

  return response.data;
};