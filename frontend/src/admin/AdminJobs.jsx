  import Navbar from "@/components/shared/Navbar";
  import { Button } from "@/components/ui/button";
  import { FaPlusCircle } from "react-icons/fa";
  import React, { useEffect, useState } from "react";
  import JobTable from "./JobTable";
  import { useNavigate } from "react-router-dom";
  import { useDispatch } from "react-redux";
  import { setSearchJobByText } from "@/redux/jobSlice";
  const AdminJobs = () => {
    const navigate = useNavigate()
    const [input,setInput] = useState("")
    const dispatch = useDispatch()
    useEffect(() => {
      dispatch(setSearchJobByText(input))
    }, [input])
    
    return (
      <div>
        <Navbar />
        <div className="my-7 max-w-[72vw] mx-auto ">
          <div className="search flex justify-between flex-wrap gap-2  ">
            <input onChange={(e)=>setInput(e.target.value)} value={input} className="px-2 outline-none border-2 border-gray-500 rounded-lg" type="text" placeholder="Search Job " />
            <div onClick={()=>navigate(`/admin/jobs/new`)} className="button flex relative">
              <Button variant={"ghost"} className={"cursor-pointer bg-[#3A506B] text-[white] text-md flex justify-between items-center"}>
                Create Job
                <FaPlusCircle/>
              </Button>
            </div>
          </div>
        <JobTable/>
        </div>
      </div>
    );
  };

  export default AdminJobs;
