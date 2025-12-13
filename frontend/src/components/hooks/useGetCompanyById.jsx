import axios from "axios";
import React, { useEffect } from "react";
import { COMPANY_API_END_POINT} from "../utils/constant";
import { useDispatch} from "react-redux";
import { toast } from "sonner";
import { setSingleCompany } from "@/redux/companySlice";

const useGetCompanyById= (companyId) => {
  const dispatch = useDispatch();
  const getCompanyById = async () => {
    try {
      const res = await axios.get(`${COMPANY_API_END_POINT}/get/${companyId}`, {
        withCredentials: true,
      });
      console.log(res)
      if (res.data.success) {
        dispatch(setSingleCompany(res.data.company));
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };
  useEffect(() => {
    getCompanyById();
  }, [companyId,dispatch]);
};

export default useGetCompanyById;
