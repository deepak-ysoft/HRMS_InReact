// axiosInstance.ts
import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
// import { removeToken, navigationTo } from "../src/helper/helper";
// import { ReactToastify } from "./shared/utils";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<any>) => {
    const status = error.response?.status;
    const message = error.response?.data?.message;

    if (status === 401) {
    } else if (status === 403) {
    } else if (status === 400) {
      if (Array.isArray(message)) {
      } else if (typeof message === "string") {
      } else {
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
