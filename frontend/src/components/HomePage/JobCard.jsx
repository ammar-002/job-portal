import React from "react";
import { Badge } from "../ui/badge";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
const JobCard = ({ job }) => {
  const navigate = useNavigate();
  return (
    <motion.div
      onClick={() => navigate(`/jobs/job-details/${job?._id}`)}
      className="bg-gray-100 shadow-md rounded-md p-6 text-center transition-transform duration-300 hover:-translate-y-2 cursor-pointer"
    >
      <div className="text-xl font-bold">{job?.title}</div>
      <div className="text-md text-[#1C2541] font-bold">
        {job?.companyId?.companyName}{" "}
        <span className="pl-3 text-[#3A506B] font-semibold text-sm">
          {job?.location}
        </span>{" "}
      </div>
      <div className="text-center">{job?.description}</div>
      <div className="flex justify-around mt-4">
        <Badge className="bg-[#3A506B] text-white">{job?.experience}</Badge>
        <Badge className="bg-[#1C2541] text-white">
          {job?.vacancies} positions
        </Badge>
        <Badge className="bg-[#b1b4b8] text-white">{job?.salary} RS </Badge>
      </div>
    </motion.div>
  );
};

export default JobCard;
