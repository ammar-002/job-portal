import axios from "axios";
import React, { useEffect } from "react";
import { APPLICATION_API_END_POINT } from "../utils/constant";
import { setAppliedJobs } from "@/redux/jobSlice";
import { useDispatch } from "react-redux";
import api from "@/utils/axiosInstance";

const useGetAppliedJobs = () => {
    const dispatch = useDispatch()
  const getAppliedJobs = async () => {
    try {
      const res = await api.get(
        `/api/v1/application/getappliedjobs`,
        { withCredentials: true }
      );
      if (res.data.success) {
        dispatch(setAppliedJobs(res?.data?.all_application))
      }
    } catch (error) {
      // console.log(error);
    }
  };
  useEffect(() => {
    getAppliedJobs();
  }, []);
};

export default useGetAppliedJobs;
