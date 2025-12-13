import Navbar from "@/components/shared/Navbar";
import { Button } from "@/components/ui/button";
import { FaPlusCircle } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import CompanyTable from "./CompanyTable";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setSearchCompanyByText } from "@/redux/companySlice";

const Companies = () => {
  const navigate = useNavigate()
  const [input,setInput] = useState("")
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(setSearchCompanyByText(input))
  }, [input])
  
  return (
    <div>
      <Navbar />
      <div className="my-7 max-w-[72vw] mx-auto ">
        <div className="search flex justify-between flex-wrap gap-2  ">
          <input onChange={(e)=>setInput(e.target.value)} className="px-2 outline-none border-2 border-gray-500 rounded-lg" type="text" placeholder="Search Company" />
          <div onClick={()=>navigate("/admin/new-company")} className="button flex relative">
            <Button variant={"ghost"} className={"cursor-pointer bg-[#3A506B] text-[white] text-md flex justify-between items-center"}>
              Company
              <FaPlusCircle/>
            </Button>
          </div>
        </div>
      <CompanyTable/>
      </div>
    </div>
  );
};

export default Companies;
