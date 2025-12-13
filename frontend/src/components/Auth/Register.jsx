import React, { useEffect } from "react";
import Navbar from "../shared/Navbar";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup } from "@radix-ui/react-radio-group";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "../utils/constant";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import store from "@/redux/store";
import { setLoading } from "@/redux/authSlics";
const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading,user } = useSelector((store) => store.auth);
  const [input, setInput] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    role: "",
    password: "",
    file: "",
  });
  const changEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };
  const changeFileHandler = (e) => {
    setInput({ ...input, file: e.target.files?.[0] });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    // file send karnay k liay form ki tarah treat karenge
    const formData = new FormData();
    formData.append("fullName", input.fullName);
    formData.append("email", input.email);
    formData.append("password", input.password);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("role", input.role);
    if (input.file) {
      formData.append("file", input.file);
    }
    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      // console.log()
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
      }
    } catch (error) {
       dispatch(setLoading(false));
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      dispatch(setLoading(false));
    }
  };
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, []);
  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center max-w-7xl mx-auto ">
        <form
          onSubmit={submitHandler}
          className="register flex flex-col gap-y-3 w-1/2 border border-gray-200 rounded-md  my-10 p-4"
        >
          <h1 className="text-2xl flex justify-center font-bold">
            Register Yourself
          </h1>
          <div className="flex flex-col gap-y-5">
            <div className="flex flex-col gap-y-1">
              <Label>Enter Fullname</Label>
              <Input
                type="text"
                value={input.fullName}
                name="fullName"
                onChange={changEventHandler}
                placeholder="User One"
              />
            </div>
            <div className="flex flex-col gap-y-1">
              <Label>Enter Email</Label>
              <Input
                type="email"
                value={input.email}
                name="email"
                onChange={changEventHandler}
                placeholder="abcdef@example.com"
              />
            </div>
            <div className="flex flex-col gap-y-1">
              <Label>Enter Phone Number</Label>
              <Input
                type="phone"
                value={input.phoneNumber}
                name="phoneNumber"
                onChange={changEventHandler}
                placeholder="+923210000000"
              />
            </div>
            <div className="flex flex-col gap-y-1">
              <Label>Enter Password</Label>
              <Input
                type="password"
                value={input.password}
                name="password"
                onChange={changEventHandler}
                placeholder="!@98%&"
              />
            </div>

            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-1">
                <Label className="mx-1">Select Role</Label>
                <RadioGroup className="flex gap-3">
                  <div className="flex items-center gap-2">
                    <Input
                      type="radio"
                      name="role"
                      id="r1"
                      checked={input.role === "student"}
                      onChange={changEventHandler}
                      value="student"
                      className="cursor-pointer"
                    />
                    <Label htmlFor="r1">Student</Label>
                  </div>
                  <div className="flex items-center gap-2 ">
                    <Input
                      type="radio"
                      id="r2"
                      name="role"
                      value="recruiter"
                      checked={input.role === "recruiter"}
                      onChange={changEventHandler}
                      className="cursor-pointer"
                    />
                    <Label htmlFor="r2">Recruiter</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="flex flex-col gap-2  ">
                <Label className="mx-1">Upload Profile Picture</Label>
                <Input
                  accept="image/*"
                  type="file"
                  onChange={changeFileHandler}
                  className=" max-w-fit cursor-pointer "
                />
              </div>
            </div>
            {loading ? (
              <Button className="w-full hover:text-[#3A506B] hover:bg-[#b1b4b8] cursor-pointer bg-[#3A506B] text-[#e9ecf0] hover:font-semibold">
                Please Wait...
              </Button>
            ) : (
              <Button
                type="submit"
                variant="ghost"
                className="w-full hover:text-[#3A506B] hover:bg-[#b1b4b8] cursor-pointer bg-[#3A506B] text-[#e9ecf0] hover:font-semibold"
              >
                Register
              </Button>
            )}
          </div>
          <p>
            Already Registered?{" "}
            <Link to={"/login"} className="text-blue-600 hover:text-blue-800">
              Login
            </Link>{" "}
          </p>
        </form>
      </div>
    </>
  );
};

export default Register;
