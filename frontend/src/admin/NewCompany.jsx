import Navbar from "@/components/shared/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { COMPANY_API_END_POINT } from "@/components/utils/constant";
import { setSingleCompany } from "@/redux/companySlice";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const NewCompany = () => {
  const dispatch = useDispatch()
  // const {company} = useSelector(store=>store.company) 
  const [companyName, setCompanyName] = useState("");
  const navigate = useNavigate();
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${COMPANY_API_END_POINT}/register`,
        {companyName},
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if(res.data.success){
        setCompanyName(res.data.companyName)
        toast.success(res.data.message)
        const companyId = res?.data?.company?._id
        dispatch(setSingleCompany(res.data.company))
        navigate(`/admin/companies/${companyId}`)
      }
    } catch (error) {
      toast.error(error.response.data.message)
      console.log(error);
    }
  };
  const changeHandler = (e)=>{
    setCompanyName(e.target.value)
  }
  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center max-w-7xl mx-auto">
        <form
          action=""
          onSubmit={submitHandler}
          className="flex flex-col gap-y-3 w-1/2 border border-gray-200 rounded-md  my-10 p-4"
        >
          <h1 className="text-2xl flex justify-center font-bold">
            Register New Company
          </h1>
          <div className="flex flex-col gap-y-5">
            <div className="flex flex-col gap-y-1">
              <Label>
                Enter Company Name<span className="text-red-500 -ml-1 ">*</span>
              </Label>
              <Input
              onChange={changeHandler}
                name="companyName"
                value={companyName}
                type={"text"}
                placeholder="ABC Company Pvt. Ltd"
              />
            </div>
            <div className="btns flex gap-2 justify-center">
              <Button
                onClick={() => {
                  navigate("/admin/companies");
                }}
                variant={"outline"}
                className={"cursor-pointer"}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant={"ghost"}
                className={
                  "hover:text-[#3A506B] hover:bg-[#b1b4b8] cursor-pointer bg-[#3A506B] text-white"
                }
              >
                Continue
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewCompany;
