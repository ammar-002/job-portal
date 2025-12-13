// import useGetCompanyById from "@/components/hooks/useGetCompanyById";
import useGetCompanyById from "@/components/hooks/useGetCompanyById";
import Navbar from "@/components/shared/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { COMPANY_API_END_POINT } from "@/components/utils/constant";
import { setSingleCompany } from "@/redux/companySlice";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { MdArrowBack } from "react-icons/md";
// import { IoMdArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const CompanySetup = () => {
  const { SingleCompany } = useSelector((store) => store.company);
  const param = useParams();
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const [loading, setloading] = useState(false);
  const companyId = param.id;
  useGetCompanyById(companyId);
  const [input, setInput] = useState({
    companyName: "",
    description: "",
    location: "",
    website: "",
    file: null,
  },);

  const changeHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };
  const fileHandler = (e) => {
    setInput({ ...input, file: e?.target?.files?.[0] });
  };
  const submitHandler = async (e) => {
    setloading(true);
    e.preventDefault();
    // console.log(input)
    const formData = new FormData();
    formData.append("companyName", input.companyName);
    formData.append("description", input.description);
    formData.append("location", input.location);
    formData.append("website", input.website);
    if (input.file) {
      formData.append("file", input.file);
    }
    try {
      
      const res = await axios.put(
        `${COMPANY_API_END_POINT}/update/${companyId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        
        // console.log("Updated=> ",res); 
        toast.success(res.data.message);
        dispatch(setSingleCompany(res.data.company))
        navigate("/admin/companies");
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message||"Something Wrong");
    } finally {
      setloading(false);
    }
  };
  useEffect(() => {
    setInput({
      companyName: SingleCompany.companyName || "",
      description: SingleCompany.description || "",
      location: SingleCompany.location || "",
      website: SingleCompany.website || "",
      file:SingleCompany.file||null
    });
  }, [SingleCompany]);

  return (
    <div>
      <Navbar />
      <div className=" mt-10 max-w-[60vw] mx-auto shadow-md shadow-gray-300 relative rounded-lg">
        <div className="pt-10">
          <h1 className="text-2xl font-bold text-center">Company Setup</h1>
          <form
            action=""
            className="flex flex-col gap-3 p-4 mt-7"
            onSubmit={submitHandler}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label>Name</Label>
                <Input
                  onChange={changeHandler}
                  name="companyName"
                  type={"text"}
                  placeholder={`${SingleCompany?.companyName}`}
                  value={input.companyName}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Description</Label>
                <Input
                  placeholder="Write About Your Company"
                  onChange={changeHandler}
                  name="description"
                  value ={input.description}
                  type={"text"}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Website</Label>
                <Input
                  placeholder="https://abc-domain.com"
                  onChange={changeHandler}
                  value ={input.website}
                  type={"text"}
                  name="website"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Location</Label>
                <Input
                  onChange={changeHandler}
                  type={"text"}
                  placeholder="Karachi,Lahore,Remote,etc"
                  name="location"
                  value ={input.location}
                />
              </div>
              <div className="flex flex-col gap-2 ">
                <Label>Logo</Label>
                <Input  type={"file"} accept="image/*" onChange={fileHandler} />

              </div>
            </div>
            {loading ? (
              <Button
                type="submit"
                className={
                  "bg-[#1C2541] text-white cursor-pointer hover:bg-gray-300 hover:text-[#1C2541]"
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
                Save
              </Button>
            )}
          </form>
          <div onClick={()=>navigate("/admin/companies")} className="absolute top-2 left-2 p-2 text-md rounded-full text-white bg-gray-400 cursor-pointer">
            <MdArrowBack/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanySetup;
