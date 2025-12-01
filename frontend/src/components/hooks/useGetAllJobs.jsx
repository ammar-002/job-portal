import axios from "axios";
import React, { useEffect } from "react";
import { JOB_API_END_POINT } from "../utils/constant";
import { useDispatch, useSelector} from "react-redux";
import { setAllJobs } from "@/redux/jobSlice";
import { toast } from "sonner";

const useGetAllJobs = () => {
  const dispatch = useDispatch();
  const {searchedQuery} = useSelector(store=>store.job)
  const getJobs = async () => {
    try {
      const res = await axios.get(`${JOB_API_END_POINT}/getalljobs?keyword=${searchedQuery}`, {
        
        withCredentials: true,
      });
      // console.log(res)
      if (res.data.success) {
        dispatch(setAllJobs(res.data.jobs));
      }
      else{
        console.log("failed");
        
      }
    } catch (error) {
      console.log(error);
      toast.error(toast.error(error.response?.data?.message || "Something went wrong"));
    }
  };
  useEffect(() => {
    getJobs();
  }, []);
};

export default useGetAllJobs;
