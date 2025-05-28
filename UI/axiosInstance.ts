import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
// import { ToastMessage } from "./src/components/ToastMsgComponent/toastMessageComponent";
import { toast } from "react-toastify";

interface ApiErrorResponse {
  IsSuccess: false;
  Message: string;
  Errors: string[];
}

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
  (error: AxiosError) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    const status = error.response?.status;
    const data = error.response?.data;

    if (status) {
      switch (status) {
        case 400:
          if (data?.Errors && Array.isArray(data.Errors)) {
            data.Errors.map((err: string) => {
              toast.error(err);
            });
          } else if (data?.Message) {
            toast.error(data.Message);
          }
          break;

        case 401:
          return toast.error(
            data?.Message || "Unauthorized access. Please log in again."
          );
          break;

        case 403:
          toast.error(data?.Message || "Access Denied");
          break;

        case 404:
          toast.error(data?.Message || "Resource Not Found");
          break;

        case 500:
          if (data?.Errors && Array.isArray(data.Errors)) {
            data.Errors.map((err: string) => {
              return toast.error(err);
            });
          } else if (data?.Message) {
            return toast.error(data.Message);
          }
          break;

        default:
          return toast.error(
            `Unexpected error (status ${status}):` + data?.Message
          );
          break;
      }
    } else if (error.message === "Network Error") {
      toast.error("Network error: Please check your internet connection.");
    } else {
      toast.error("Unhandled error: " + error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
