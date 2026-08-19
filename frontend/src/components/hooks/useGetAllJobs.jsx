import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAllJobs, setJobsPagination } from "@/redux/jobSlice";
import { toast } from "sonner";
import api from "@/utils/axiosInstance";
import { useSearchParams } from "react-router-dom";

const useGetAllJobs = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  const getJobs = async () => {
    try {
      // Agar page URL mein nahi hai, default "1" use karo
      const params = new URLSearchParams(searchParams);
      if (!params.get("page")) params.set("page", "1");
      if (!params.get("limit")) params.set("limit", "9");

      const res = await api.get(`/api/v1/job/getalljobs?${params.toString()}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setAllJobs(res.data.jobs));
        dispatch(setJobsPagination({
          currentPage: res.data.currentPage,
          totalPages: res.data.totalPages,
          totalJobs: res.data.totalJobs,
        }));
      }
    } catch (error) {
      console.log("Error: " + error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    getJobs();
  }, [searchParams]);
};

export default useGetAllJobs;