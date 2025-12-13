import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import useGetAppliedJobs from "../hooks/useGetAppliedJobs";
import { useSelector } from "react-redux";

const AppliedJobsTable = () => {
  const { AppliedJobs } = useSelector((store) => store.job);
  useGetAppliedJobs();
  return (
    <div className="w-[90vw] md:w-[70vw] mx-auto bg-blue-100 shadow-md rounded-lg mt-3 p-3 mb-5">
      <Table>
        <TableHeader>
          <TableRow className={"text-lg font-semibold text-blue-800"}>
            <TableHead className="w-[100px]">Date</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Company</TableHead>
            <TableHead className="text-center">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {AppliedJobs.map((item) => (
            <TableRow key={item?._id} className={"text-gray-700 text-md "}>
              <TableCell className="font-medium">
                {new Date(item?.job?.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>{item?.job?.title}</TableCell>
              <TableCell>{item?.job?.companyId?.companyName}</TableCell>
              <TableCell className="text-center">
                <Badge
                  className={`text-white ${
                    item?.status === "pending"
                      ? "bg-yellow-500"
                      : item?.status === "accepted"
                      ? "bg-green-600"
                      : item?.status === "rejected"
                      ? "bg-red-600"
                      : "bg-gray-400" // default (agar status match na kare)
                  }`}
                >
                  {item?.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AppliedJobsTable;
