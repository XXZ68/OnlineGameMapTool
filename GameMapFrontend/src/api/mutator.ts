import axios, { type AxiosRequestConfig } from "axios";

export const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  return axios({
    ...config,
    ...options,
    baseURL: "http://localhost:5089",
  }).then(({ data }) => data);
};