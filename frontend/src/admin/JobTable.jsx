import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CiMenuKebab } from "react-icons/ci";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import { FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useGetAllAdminJobs from "@/components/hooks/useGetAllAdminJobs";
import { JOB_API_END_POINT } from "@/components/utils/constant";
import { setAllAdminJobs } from "@/redux/jobSlice";
import { toast } from "sonner";
const JobTable = () => {
  const dispatch = useDispatch();
  useGetAllAdminJobs();
  const { AllAdminJobs, searchJobByText } = useSelector((store) => store.job);
  const [tempJobs, settempJobs] = useState(AllAdminJobs);
  const navigate = useNavigate();
  const deleteHanlde = async (jobId) => {
    try {
      const res = await axios.delete(`${JOB_API_END_POINT}/delete/${jobId}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        const updatedJobs = AllAdminJobs.filter((job) => job._id !== jobId);
        dispatch(setAllAdminJobs(updatedJobs));
      }
      console.log(res.data.message);
      
      toast.success(res.data.message);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };
  useEffect(() => {
    const filteredJobs =
      AllAdminJobs?.length >= 0 &&
      AllAdminJobs.filter((job) => {
        if (!searchJobByText) {
          return true;
        }
        return (
          job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) ||
          job?.companyId?.companyName
            .toLowerCase()
            .includes(searchJobByText.toLowerCase())
        );
      });
    settempJobs(filteredJobs);
  }, [AllAdminJobs, searchJobByText]);
  return (
    <div className="my-7">
      <Table>
        <TableCaption className={"font-normal text-gray-400 text-lg"}>
          List Of Posted Jobs
        </TableCaption>
        <TableHeader>
          <TableRow className={"text-lg font-semibo ld text-blue-800 "}>
            <TableHead>Company</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tempJobs.map((item, index) => (
            <TableRow key={index} className={"text-gray-700 text-md "}>
              <TableCell className="font-medium">
                {item?.companyId?.companyName}
              </TableCell>
              <TableCell>{item?.title}</TableCell>
              <TableCell>
                {format(new Date(item?.createdAt), "dd MMM yyyy")}
              </TableCell>
              <TableCell>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      className={"text-sm cursor-pointer bg-gray-50 shadow-md"}
                    >
                      <CiMenuKebab />{" "}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-35 mr-3 bg-gray-100 text-gray-600 flex flex-col gap-3 border-none ">
                    <div
                      className="flex items-center justify-center gap-2 hover:bg-gray-200  shadow-sm shadow-gray-500 rounded-md py-1  cursor-pointer  "
                      onClick={() => deleteHanlde(item._id)}
                    >
                      <span>Delete</span>
                      <MdDelete className="text-lg" />
                    </div>
                    <div
                      onClick={() =>
                        navigate(`/admin/jobs/${item?._id}/applicants`)
                      }
                      className="flex items-center justify-center gap-2 hover:bg-gray-200  shadow-sm shadow-gray-500 rounded-md py-1  cursor-pointer  "
                    >
                      <span>Applicants</span>{" "}
                      <div>
                        <FaEye />
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default JobTable;
