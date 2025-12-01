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
import useGetAllCompanies from "@/components/hooks/useGetAllCompanies";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { COMPANY_API_END_POINT } from "@/components/utils/constant";
import { toast } from "sonner";
import { setAllCompanies } from "@/redux/companySlice";
import Companies from "./Companies";
const CompanyTable = () => {
  const dispatch = useDispatch();
  useGetAllCompanies();
  const { AllCompanies,searchCompanyByText } = useSelector((store) => store.company);
  const [tempCompanies, settempCompanies] = useState(AllCompanies);
  const navigate = useNavigate();
  const deleteHanlde = async (companyId) => {
    try {
      const res = await axios.delete(
        `${COMPANY_API_END_POINT}/delete/${companyId}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedCompanies = AllCompanies.filter(
          (company) => company._id !== companyId
        );
        dispatch(setAllCompanies(updatedCompanies));
      }
      toast.success(res.data.message);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };
  useEffect(() => {
    const filteredCompanies = AllCompanies.length>=0 && AllCompanies.filter((company)=>{
      if(!searchCompanyByText){
        return true
      }
      return company?.companyName?.toLowerCase().includes(searchCompanyByText.toLowerCase())
    })
    settempCompanies(filteredCompanies)
  }, [AllCompanies,searchCompanyByText])
  
  return (
    <div className="my-7">
      <Table>
        <TableCaption className={"font-normal text-gray-400 text-lg"}>
          List Of Registered Companies
        </TableCaption>
        <TableHeader>
          <TableRow className={"text-lg font-semibold text-blue-800 "}>
            <TableHead>Logo</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tempCompanies.map((item, index) => (
            <TableRow key={index} className={"text-gray-700 text-md "}>
              <TableCell className="font-medium">
                <Avatar className="cursor-pointer ">
                  <AvatarImage src={item.logo} alt="@shadcn" />
                </Avatar>
              </TableCell>
              <TableCell>{item.companyName}</TableCell>
              <TableCell>
                {format(new Date(item.createdAt), "dd MMM yyyy")}
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
                  <PopoverContent className="w-28 mr-3 bg-gray-100 text-gray-600 flex flex-col gap-3 border-none ">
                    <div
                      className="flex items-center justify-center gap-2 hover:bg-gray-200  shadow-sm shadow-gray-500 rounded-md py-1  cursor-pointer   "
                      onClick={() => navigate(`/admin/companies/${item._id}`)}
                    >
                      <span>Edit</span>
                      <FaEdit className="text-lg" />{" "}
                    </div>
                    <div
                      className="flex items-center justify-center gap-2 hover:bg-gray-200  shadow-sm shadow-gray-500 rounded-md py-1  cursor-pointer  "
                      onClick={() => deleteHanlde(item._id)}
                    >
                      <span>Delete</span>
                      <MdDelete className="text-lg" />
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

export default CompanyTable;
