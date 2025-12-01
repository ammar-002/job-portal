import { Button } from "@/components/ui/button";
import { PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Popover } from "@radix-ui/react-popover";
import { TiTick } from "react-icons/ti";
import React from "react";
import { CgMore } from "react-icons/cg";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { APPLICATION_API_END_POINT } from "@/components/utils/constant";
import { toast } from "sonner";

const ApplicantsTable = () => {
  const { AllApplicants } = useSelector((store) => store.application);
  const statusHandler = async (status, Id) => {
    console.log(Id)
    try {
      const res = await axios.post(
        `${APPLICATION_API_END_POINT}/status/${Id}`,
        { status },
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };
  const shortlistingStatus = ["accepted", "rejected"];
  return (
    <div className="mt-4">
      <Table>
        <TableCaption className="font-normal text-gray-400 text-lg">
          List of Applicants
        </TableCaption>
        <TableHeader>
          <TableRow className="text-lg font-semibold text-blue-800">
            <TableHead>FullName</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>PhoneNumber</TableHead>
            <TableHead>Resume</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {AllApplicants.map((item) => (
            <TableRow key={item._id} className="text-gray-700 ">
              <TableCell className="font-medium">
                {item?.applicant?.fullName}
              </TableCell>
              <TableCell>{item?.applicant?.email}</TableCell>
              <TableCell>{item?.applicant?.phoneNumber}</TableCell>
              <TableCell>
                <Link
                  target="blank"
                  className={"text-blue-500 hover:font-semibold"}
                  to={item?.applicant?.profile?.resume}
                >
                  {item?.applicant?.profile?.resumeOriginalName}
                </Link>
              </TableCell>
              <TableCell>
                {new Date(item?.applicant?.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className={"flex cursor-pointer justify-center"}>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline">
                      {" "}
                      <CgMore />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-35 flex flex-col gap-1">
                    {shortlistingStatus.map((status, index) => {
                      return (
                        <div
                          onClick={() => statusHandler(status, item?._id)}
                          key={index}
                          className="flex w-fit items-center my-2 cursor-pointer"
                        >
                          <span>{status}</span>
                        </div>
                      );
                    })}
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

export default ApplicantsTable;
