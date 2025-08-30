import { ACCESS_TOKEN_NAME, API_URL } from "@/constants";
import { getCookie } from "@/utils/cookie";
import axios from "axios";

export const axiosClient = axios.create({
  baseURL: API_URL,
});

axiosClient.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${getCookie(ACCESS_TOKEN_NAME)}`;
  return config;
});
