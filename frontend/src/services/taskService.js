import axios from "axios";
import { auth } from "../firebase";

const DEFAULT_API_BASE_URLS = [
  "http://localhost:5242/api/tasks",
  "https://localhost:7135/api/tasks",
];

const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const apiBaseUrls = configuredApiBaseUrl
  ? [configuredApiBaseUrl]
  : DEFAULT_API_BASE_URLS;

const getAuthHeader = async () => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User not authenticated");
  }

  const token = await user.getIdToken();

  return {
    Authorization: `Bearer ${token}`,
  };
};

const getRequestConfig = async () => ({
  headers: await getAuthHeader(),
});

const isNetworkError = (error) =>
  error?.message === "Network Error" || error?.code === "ERR_NETWORK";

const withApiFallback = async (requestFactory) => {
  const attemptedUrls = [];
  let lastError;

  for (const baseUrl of apiBaseUrls) {
    attemptedUrls.push(baseUrl);

    try {
      return await requestFactory(baseUrl);
    } catch (error) {
      lastError = error;

      if (!isNetworkError(error)) {
        throw error;
      }
    }
  }

  if (lastError) {
    lastError.attemptedUrls = attemptedUrls;
    throw lastError;
  }

  throw new Error("No API base URL configured.");
};

export const getTasks = async () => {
  const config = await getRequestConfig();
  const response = await withApiFallback((baseUrl) => axios.get(baseUrl, config));
  return response.data;
};

export const createTask = async (taskData) => {
  const config = await getRequestConfig();
  const response = await withApiFallback((baseUrl) => axios.post(baseUrl, taskData, config));
  return response.data;
};

export const updateTask = async (id, taskData) => {
  const config = await getRequestConfig();
  const response = await withApiFallback((baseUrl) => axios.put(`${baseUrl}/${id}`, taskData, config));
  return response.data;
};

export const deleteTask = async (id) => {
  const config = await getRequestConfig();
  const response = await withApiFallback((baseUrl) => axios.delete(`${baseUrl}/${id}`, config));
  return response.data;
};

export const getConfiguredApiBaseUrls = () => [...apiBaseUrls];
