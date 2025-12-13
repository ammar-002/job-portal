import React, { useEffect } from "react";
import Navbar from "../shared/Navbar";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup } from "@radix-ui/react-radio-group";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { USER_API_END_POINT } from "../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import store from "@/redux/store";
import { setLoading, setUser } from "@/redux/authSlics";
const Login = () => {
  
  const dispatch = useDispatch();
  const {loading,user}  = useSelector(store => store.auth);
  
  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "",
  });
  const changEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };
  const changeFileHandler = (e) => {
    setInput({ ...input, file: e.target.files?.[0] });
  };
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      if (res.data.success) {
        console.log(res)
        toast.success(res.data.message);
        console.log(res)
        dispatch(setUser(res.data.user))
        navigate("/");
        
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(()=>{
    if(user){
      navigate("/")
    }
  },[])
  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center max-w-7xl mx-auto ">
        <form
          onSubmit={submitHandler}
          className="register flex flex-col gap-y-3 w-1/2 border border-gray-200 rounded-md  my-10 p-4"
        >
          <h1 className="text-2xl flex justify-center font-bold">
            Login Yourself
          </h1>
          <div className="flex flex-col gap-y-5">
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
                      id="r1"
                      type="radio"
                      name="role"
                      checked={input.role === "student"}
                      onChange={changEventHandler}
                      value="student"
                      className="curosor-pointer"
                    />
                    <Label htmlFor="r1">Student</Label>
                  </div>
                  <div className="flex items-center gap-2 ">
                    <Input
                      type="radio"
                      name="role"
                      id="r2"
                      checked={input.role === "recruiter"}
                      onChange={changEventHandler}
                      value="recruiter"
                      className="curosor-pointer"
                    />
                    <Label htmlFor="r2">Recruiter</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            {
              loading?( <Button className="w-full hover:text-[#3A506B] hover:bg-[#b1b4b8] cursor-pointer bg-[#3A506B] text-[#e9ecf0] hover:font-semibold">
                Please Wait...
              </Button>):(
              <Button
              type="submit"
              variant="ghost"
              className="w-full hover:text-[#3A506B] hover:bg-[#b1b4b8] cursor-pointer bg-[#3A506B] text-[#e9ecf0] hover:font-semibold"
            >
              Sign In
            </Button>)
            }
          </div>
          <p>
            Don't Have An Account?{" "}
            <Link
              to={"/register"}
              className="text-blue-600 hover:text-blue-800"
            >
              SignUp
            </Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default Login;
