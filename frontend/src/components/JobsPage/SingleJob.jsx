import React from "react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { FaBookmark } from "react-icons/fa";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

const SingleJob = ({ job }) => {
  const id = job?._id;
  const navigate = useNavigate();
  const createdAt = job?.createdAt;
  let timeAgo = "unavailable";
  if (createdAt) {
    const parsedDate = new Date(createdAt);
    if (!isNaN(parsedDate)) {
      timeAgo = formatDistanceToNow(parsedDate, { addSuffix: true });
    }
  }
  return (
    <div className=" bg-gray-100 shadow-md border-gray-200 p-4 mt-3 rounded-lg flex flex-col gap-2 ">
      <div className="flex  justify-between items-center">
        <p className="text-gray-400 text-sm">{timeAgo}</p>
        <div className="bg-gray-300 text-[#1C2541]  rounded-full p-2 cursor-pointer">
          <FaBookmark className="text-md " />{" "}
        </div>
      </div>
      <div className="companyInfo flex items-center gap-3 ">
        <Button className="  border-2 border-gray-300" size="icon ">
          <Avatar>
            <AvatarImage src= {job?.companyId?.logo} />
          </Avatar>
        </Button>
        <div>
          <p className="text-md font-medium text-[#1C2541]">
            {job?.companyId?.companyName}
          </p>
          <p className="text-sm text-gray-600">{job?.location}</p>
        </div>
      </div>
      <div className="job-title-desc flex flex-col gap-1">
        <div className="font-bold text-[#1C2541] text-md">{job?.title} </div>
        <div className="text-sm text-gray-700 ">{job?.description}</div>
      </div>
      <div className="tags flex justify-around">
        <Badge className="font-semibold text-sm shadow-sm bg-gray-100 rounded-lg text-[rgb(58,80,107)] ">
          {job?.experience}
        </Badge>
        <Badge className="font-semibold text-sm shadow-sm bg-gray-100 rounded-lg text-[#1C2541] ">
          {" "}
          {job?.vacancies} positions
        </Badge>
        <Badge className="font-semibold text-sm shadow-sm bg-gray-100 rounded-lg text-[#5c5c5c] ">
          {" "}
          {job?.salary} RS
        </Badge>
      </div>
      <div className="btns flex justify-center gap-4 mt-3">
        <Button
          onClick={() => navigate(`/jobs/job-details/${id}`)}
          className={
            "border-1 border-gray-200 cursor-pointer shadow-md hover:text-blue-800 "
          }
        >
          Details
        </Button>
        <Button
          variant="ghost"
          className="bg-[#1C2541] text-white cursor-pointer shadow-sm"
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default SingleJob;
