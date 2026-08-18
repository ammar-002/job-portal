import axios from "axios";
import React, { useEffect } from "react";
import { JOB_API_END_POINT } from "../utils/constant";
import { useDispatch, useSelector} from "react-redux";
import { setAllJobs,setJobsPagination } from "@/redux/jobSlice";
import { toast } from "sonner";
import api from "@/utils/axiosInstance";

const useGetAllJobs = (page=1, limit=10) => {
  const dispatch = useDispatch();
  const {searchedQuery} = useSelector(store=>store.job)
  const getJobs = async () => {
    try {
      const res = await api.get(`/api/v1/job/getalljobs?page=${page}&limit=${limit}`, {
        withCredentials: true,
      });
      // console.log(res)
      if (res.data.success) {
        dispatch(setAllJobs(res.data.jobs));
        dispatch(setJobsPagination({
          currentPage: res.data.currentPage,
          totalPages: res.data.totalPages,
          totalJobs: res.data.totalJobs,
        }));
      }
      else{
        // console.log("failed");
        
      }
    } catch (error) {
      console.log("Error: "+error);
      toast.error(error.response?.data?.message || "Something went wrong")
    }
  };
  useEffect(() => {
    getJobs();
  }, [page]);
};

export default useGetAllJobs;
