import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { ServerSource } from "@/components/filter/ServerSourceSelector";
import { baseUrl } from "@/api/baseUrl";

/**
 * Creates an axios instance configured for the specified server source
 */
export function createServerAxios(source: ServerSource): AxiosInstance {
  const config: AxiosRequestConfig = {};

  if (source.type === "remote" && source.serverUrl) {
    config.baseURL = source.serverUrl;
  } else {
    config.baseURL = baseUrl;
  }

  return axios.create(config);
}

/**
 * Makes a GET request to the appropriate server based on the source
 */
export async function fetchFromServer<T>(
  source: ServerSource,
  path: string,
  params?: Record<string, unknown>,
): Promise<T> {
  const axiosInstance = createServerAxios(source);
  const response = await axiosInstance.get(path, { params });
  return response.data;
}
