import axios from "axios";
import React, { useEffect } from "react";
import { COMPANY_API_END_POINT } from "../utils/constant";
import { useDispatch, useSelector} from "react-redux";
import { toast } from "sonner";
import { setAllCompanies } from "@/redux/companySlice";
import api from "@/utils/axiosInstance";

const useGetAllCompanies = () => {
  const dispatch = useDispatch();
  const getAllCompanies = async () => {
    try {
      const res = await api.get(`/api/v1/company/get`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setAllCompanies(res.data.companies))
      }
      
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong")
    }
  };
  useEffect(() => {
    getAllCompanies();
  }, []);
};

export default useGetAllCompanies;
