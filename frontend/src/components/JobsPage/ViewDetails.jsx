import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
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
    );

  const [isApplied, setisApplied] = useState(isInitiallyApplied);

  const params = useParams();
  const jobId = params.id;

  const date = singleJob?.createdAt;
  const onlyDate = new Date(date).toLocaleDateString();

  const getSingleJob = async () => {
    try {
      const res = await axios.get(`${JOB_API_END_POINT}/getjobby/${jobId}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setSingleJob(res.data.job));
        setisApplied(
          res.data.job.applications.some(
            (application) => application.applicant === user?._id
          )
        );
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
        const singleUpdatedJob = {
          ...singleJob,
          applications: [
            ...singleJob.applications,
            { applicant: user?._id },
          ],
        };
        dispatch(setSingleJob(singleUpdatedJob));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    getSingleJob();
  }, []);

  return (
    <div className="relative max-w-5xl mx-auto mt-12 bg-white rounded-xl shadow-lg border border-gray-200 p-8">
      
      {/* Back Button */}
      <button
        onClick={() => navigate("/jobs")}
        className="absolute top-4 left-4 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition"
      >
        <IoMdArrowRoundBack className="text-xl" />
      </button>

      {/* Header */}
      <div className="flex flex-col mt-10 md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold text-[#1C2541]">
          {singleJob?.title}
        </h1>

        <Button
          onClick={isApplied ? null : applyHandler}
          disabled={isApplied}
          className={`px-6 py-2 text-lg rounded-lg ${
            isApplied
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#2563EB] hover:bg-[#1D4ED8] text-white"
          }`}
        >
          {isApplied ? "Applied" : "Apply Now"}
        </Button>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-3 mt-6">
        <Badge className="bg-blue-50 text-blue-700 text-sm px-3 py-1">
          {singleJob?.vacancies} Positions
        </Badge>
        <Badge className="bg-green-50 text-green-700 text-sm px-3 py-1">
          {singleJob?.salary} RS
        </Badge>
        <Badge className="bg-purple-50 text-purple-700 text-sm px-3 py-1">
          {singleJob?.experience}
        </Badge>
      </div>

      {/* Divider */}
      <div className="my-6 border-t border-gray-200"></div>

      {/* Job Details */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-[#1C2541]">
          Job Description
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg">
          <p>
            <span className="font-semibold">Role:</span>{" "}
            {singleJob?.title}
          </p>
          <p>
            <span className="font-semibold">Location:</span>{" "}
            {singleJob?.location}
          </p>
          <p className="md:col-span-2">
            <span className="font-semibold">Description:</span>{" "}
            {singleJob?.description}
          </p>
          <p>
            <span className="font-semibold">Experience:</span>{" "}
            {singleJob?.experience}
          </p>
          <p>
            <span className="font-semibold">Salary:</span>{" "}
            {singleJob?.salary} RS
          </p>
          <p>
            <span className="font-semibold">Applicants:</span>{" "}
            {singleJob?.applications.length}
          </p>
          <p>
            <span className="font-semibold">Posted At:</span>{" "}
            {onlyDate}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ViewDetails;
