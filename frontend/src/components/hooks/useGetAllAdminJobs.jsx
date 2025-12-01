import axios from "axios";
import React, { useEffect } from "react";
import { JOB_API_END_POINT } from "../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { setAllAdminJobs } from "@/redux/jobSlice";

const useGetAllAdminJobs = () => {
  const { AllAdminJobs } = useSelector((store) => store.job);
  const dispatch = useDispatch();
  const getAllAdminJobs = async () => {
    try {
      const res = await axios.get(`${JOB_API_END_POINT}/getadminjobs`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setAllAdminJobs(res.data.jobs));
        console.log(AllAdminJobs);
      }
    } catch (error) {
      console.log(error);
      toast.error(
        toast.error(error.response?.data?.message || "Something went wrong")
      );
    }
  };
  useEffect(() => {
    getAllAdminJobs();
  }, []);
};

export default useGetAllAdminJobs;
