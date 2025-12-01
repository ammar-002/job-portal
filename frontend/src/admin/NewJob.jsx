import Navbar from "@/components/shared/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IoMdArrowRoundBack } from "react-icons/io";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { JOB_API_END_POINT } from "@/components/utils/constant";
import { setSingleAdminJob } from "@/redux/jobSlice";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const NewJob = () => {
  const { AllCompanies } = useSelector((store) => store.company);
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    experience: "",
    location: "",
    vacancies: "",
    companyId: "",
  });
  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${JOB_API_END_POINT}/createjob`, input, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setSingleAdminJob(res.data.job))
        navigate("/admin/jobs")
        toast.success(res.data.message)
        //find why setsingleadminjob
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  const changeHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };
  const selectHandle = (value) => {
    const selectedCompany = AllCompanies.find(
      (company) => company?.companyName?.toLowerCase() === value
    );
    setInput({ ...input, companyId: selectedCompany._id });
  };
  return (
    <div>
      <Navbar />
      <div className=" mt-10 max-w-[60vw] mx-auto shadow-md shadow-gray-300 relative rounded-lg">
        <div className="pt-6">
          <h1 className="text-3xl font-bold text-center">Post New Job</h1>
          <form
            action=""
            className="flex flex-col gap-3 p-4 mt-7"
            onSubmit={submitHandler}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label>Job Title</Label>
                <Input
                  name="title"
                  value={input.title}
                  onChange={changeHandler}
                  placeholder="Full Stack Developer"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Description</Label>
                <Input
                  name="description"
                  value={input.description}
                  onChange={changeHandler}
                  placeholder="We Need Full Stack Web Dev with 4 yrs of exp....."
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Requirements</Label>
                <Input
                  name="requirements"
                  value={input.requirements}
                  onChange={changeHandler}
                  placeholder="HTML, CSS, JS"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>
                  Salary <span className="text-gray-400">(In Numbers)</span>
                </Label>
                <Input
                 name="salary"
                  value={input.salary}
                onChange={changeHandler} placeholder="5600" />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Experience</Label>
                <Input 
                name="experience"
                value={input.experience}
                 onChange={changeHandler} placeholder="4 Years" />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Location </Label>
                <Input 
                name ="location"
                value ={input.location}
                onChange={changeHandler} placeholder="Remote" />
              </div>
              <div className="flex flex-col gap-2 ">
                <Label>Vacancies </Label>
                <Input
                name ="vacancies"
                value ={input.vacancies}
                  onChange={changeHandler}
                  type={"number"}
                  placeholder="2"
                />
              </div>
              <div className=" flex flex-col gap-2  ">
                {AllCompanies.length > 0 && (
                  <>
                    <Label>Company Name</Label>
                    <Select onValueChange={selectHandle}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a Company" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectGroup>
                          {AllCompanies.map((item) => (
                            <SelectItem
                            
                              key={item?._id}
                              value={item?.companyName?.toLowerCase()}
                            >
                              {item?.companyName}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </>
                )}
              </div>
            </div>

            {loading ? (
              <Button
                type="submit"
                className={
                  "bg-[#1C2541] w-[full] text-white cursor-pointer hover:bg-gray-300 hover:text-[#1C2541]"

                }
              >
                Please Wait...
              </Button>
            ) : (
              <Button
                className={
                  "bg-[#1C2541] text-white cursor-pointer hover:bg-gray-300 hover:text-[#1C2541]"
                }
              >
                Post Job
              </Button>
            )}
            {AllCompanies.length == 0 && (
              <span className="text-red-600 text-center font-[500]">
                please{" "}
                <span className="text-blue-800">
                  <Link to={"/admin/new-company/"}>Register</Link>
                </span>{" "}
                company to post a job
              </span>
            )}
          </form>
        </div>
        <div className="absolute top-2 left-2 p-2 bg-gray-200 rounded-full cursor-pointer" onClick={()=>{navigate("/admin/jobs")}}><IoMdArrowRoundBack/></div>
      </div>
    </div>
  );
};

export default NewJob;
