import Navbar from "@/components/shared/Navbar";
import React, { useEffect } from "react";
import ApplicantsTable from "./ApplicantsTable";
import axios from "axios";
import { APPLICATION_API_END_POINT } from "@/components/utils/constant";
import { useParams } from "react-router-dom";
import { setAllApplicants } from "@/redux/applicationSlice";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";

const Applicants = () => {
  const param = useParams();
  const jobId = param.id;
  const {AllApplicants} = useSelector(store=>store.application)
  const dispatch = useDispatch()
  const getApplicants = async () => {
    try {
      const res = await axios.get(
        `${APPLICATION_API_END_POINT}/${jobId}/applicants`,
        { withCredentials: true }
      );

      if(res.data.success){
        console.log(res.data.jobs.applications)
        dispatch(setAllApplicants(res?.data?.jobs?.applications))
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message)
    }
  };

  useEffect(() => {
    getApplicants();
  }, [jobId]);
  return (
    <div>
      <Navbar />
      <div className="w-[80vw] mx-auto mt-8">
        <h1 className="text-xl font-bold">Applicants({AllApplicants?.length})</h1>
        <ApplicantsTable />
      </div>
    </div>
  );
};

export default Applicants;
