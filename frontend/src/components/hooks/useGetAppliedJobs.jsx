import axios from "axios";
import React, { useEffect } from "react";
import { APPLICATION_API_END_POINT } from "../utils/constant";
import { setAppliedJobs } from "@/redux/jobSlice";
import { useDispatch } from "react-redux";

const useGetAppliedJobs = () => {
    const dispatch = useDispatch()
  const getAppliedJobs = async () => {
    try {
      const res = await axios.get(
        `${APPLICATION_API_END_POINT}/getappliedjobs`,
        { withCredentials: true }
      );
      if (res.data.success) {
        dispatch(setAppliedJobs(res?.data?.all_application))
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAppliedJobs();
  }, []);
};

export default useGetAppliedJobs;
