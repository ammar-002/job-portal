import axios from "axios";
import { toast } from "sonner";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
});
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error)=>{
  error
  ?failedQueue.forEach((prom)=>prom.reject(error))
  :failedQueue.forEach((prom)=>prom.resolve())
  failedQueue=[]
}
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error?.response?.data?.code === "TOKEN_EXPIRED" &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({resolve, reject});
        }).then(() => api(originalRequest));
      }
      originalRequest._retry = true
      isRefreshing = true

      try {
        await api.post("/api/v1/user/refresh-token")
        processQueue(null)
        return api(originalRequest)
      } catch (error) {
      toast.error(error.response.data.message)
        // console.log(error)
        processQueue(error)
        window.location.href = '/login'
        return Promise.reject(error)
      }
      finally{
        isRefreshing =false
      }
    }
    return Promise.reject(error);

  },
);

export default api