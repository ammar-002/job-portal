import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
// import useGetJobById from "../hooks/useGetJobById";
import { useDispatch, useSelector } from "react-redux";
import store from "@/redux/store";
import { setSingleJob } from "@/redux/jobSlice";
import axios from "axios";
import {
  APPLICATION_API_END_POINT,
  JOB_API_END_POINT,
} from "../utils/constant";
import { toast } from "sonner";

const ViewDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const { singleJob } = useSelector((store) => store.job);
  const isInitiallyApplied =
    singleJob?.applications?.some(
      (application) => application.applicant === user?._id
    ) ;
    // console.log(isInitiallyApplied);
    
  const [isApplied, setisApplied] = useState(isInitiallyApplied);

  // params
  const params = useParams();
  const jobId = params.id;
  // simple assignment

  // date purify
  const date = singleJob?.createdAt;
  const onlyDate = new Date(date).toLocaleDateString();
  const getSingleJob = async () => {
    try {
      const res = await axios.get(`${JOB_API_END_POINT}/getjobby/${jobId}`, {
        withCredentials: true,
        
      });
      // console.log(res)
      if (res.data.success) {
        dispatch(setSingleJob(res?.data?.job));
        setisApplied(res?.data?.job?.applications?.some(
      (application) => application.applicant === user?._id
    ) );
        // toast.success(res.data.message)
      }
    } catch (error) {
      console.log(error);
    }
  };
  const applyHandler = async () => {
    try {
      const res = await axios.get(
        `${APPLICATION_API_END_POINT}/apply/${jobId}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        setisApplied(true);
        const singleUpdatedJob ={...singleJob,applications:[...singleJob.applications,{applicant:user?._id}]}
        toast.success(res.data.message);
        dispatch(setSingleJob(singleUpdatedJob))
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    }
  };
  useEffect(() => {
    getSingleJob();
  }, []);
  return (
    <div className="relative bg-gray-50 border-1 border-gray-100 shadow-md max-w-[90vw] md:max-w-[70vw] mx-auto mt-10 p-10">
      <div className="flex justify-between ">
        <div className="title text-2xl font-bold">{singleJob?.title}</div>
        <Button
          onClick={isApplied ? null : applyHandler}
          disabled={isApplied}
          variant={"ghost"}
          className={"bg-[#1C2541] text-white text-lg cursor-pointer"}
        >
          {isApplied ? "Applied" : "Apply"}
        </Button>
      </div>
      <div className="badges flex gap-4 mt-4">
        <Badge className={"text-sm bg-gray-100 text-[#1C2541] "}>
          {singleJob?.vacancies} positions
        </Badge>
        <Badge className={"text-sm bg-gray-100 text-[#1C2541]"}>
          {singleJob?.salary}
        </Badge>
        <Badge className={"text-sm bg-gray-100 text-[#1C2541]"}>
          {singleJob?.experience}{" "}
        </Badge>
      </div>
      <div className="description ">
        <div>
          <div className="text-xl font-bold text-[#1C2541] mt-5">
            Job Description
          </div>
          <hr />
        </div>
        <div className="details flex flex-col gap-2 mt-2 ">
          <div className="font-semibold text-lg">
            Role: <span className="font-normal">{singleJob?.title}</span>
          </div>
          <div className="font-semibold text-lg">
            Location: <span className="font-normal">{singleJob?.location}</span>
          </div>
          <div className="font-semibold text-lg">
            Description: <span className="font-normal">{singleJob?.description}</span>
          </div>
          <div className="font-semibold text-lg">
            Experience: <span className="font-normal">{singleJob?.experience}</span>
          </div>
          <div className="font-semibold text-lg">
            Salary: <span className="font-normal">{singleJob?.salary} RS</span>
          </div>
          <div className="font-semibold text-lg">
            Applicants:{" "}
            <span className="font-normal">{singleJob?.applications.length}</span>
          </div>
          <div className="font-semibold text-lg">
            Posted At: <span className="font-normal">{onlyDate}</span>
          </div>
        </div>
      </div>
      <div
        className="bg-gray-200 p-2 rounded-full text-lg cursor-pointer inline-block absolute top-1 left-1"
        onClick={() => navigate("/jobs")}
      >
        <IoMdArrowRoundBack />
      </div>
    </div>
  );
};

export default ViewDetails;
