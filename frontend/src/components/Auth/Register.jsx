import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup } from "@radix-ui/react-radio-group";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/redux/authSlics";
import api from "@/utils/axiosInstance";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, user } = useSelector((store) => store.auth);

  const [step, setStep] = useState(1);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [resendLoading, setResendLoading] = useState(false);
  const [timerKey, setTimerKey] = useState(0);

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

  // Step 1 — Register form submit
  const submitHandler = async (e) => {
    e.preventDefault();
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
      const res = await api.post(`/api/v1/user/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        setRegisteredEmail(input.email);
        setTimeLeft(60);
        setTimerKey((prev) => prev + 1);
        setStep(2);
      }
    } catch (error) {
      console.log(error)
      const err = error?.response?.data;
      if (err?.errors?.length > 0) {
        toast.error(err.errors[0].message);
      } else {
        toast.error(err?.message || "Something went wrong");
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Step 2 — OTP verify submit
  const verifyOtpHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch(setLoading(true));
      const res = await api.post(
        `/api/v1/user/verify-email`,
        { email: registeredEmail, otp },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
      }
    } catch (error) {
      console.log(error)
      const err = error?.response?.data;
      toast.error(err?.message || "OTP verification failed");
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Step 2 — Resend OTP
  const resendOtpHandler = async () => {
    try {
      setResendLoading(true);
      const res = await api.post(
        `/api/v1/user/resend-otp`,
        { email: registeredEmail },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        setTimeLeft(60);
        setOtp("");
        setTimerKey((prev) => prev + 1);
      }
    } catch (error) {
      console.log(error)
      const err = error?.response?.data;
      toast.error(err?.message || "Failed to resend OTP");

      if (err?.message === "Session expired. Please register again.") {
        setTimeout(() => {
          setStep(1);
          setOtp("");
          setTimeLeft(60);
        }, 1500);
      }
    } finally {
      setResendLoading(false);
    }
  };

  // useEffect(() => {
  // if (user) navigate("/");
  // }, [user,navigate]);

  // timerKey change hone pe timer fresh start hoga
  useEffect(() => {
    if (step !== 2) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [step, timerKey]);

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center max-w-7xl mx-auto">

        {/* ── STEP 1: Registration Form ── */}
        {step === 1 && (
          <form
            onSubmit={submitHandler}
            className="flex flex-col gap-y-3 w-1/2 border border-gray-200 rounded-md my-10 p-4"
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
                    <div className="flex items-center gap-2">
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
                <div className="flex flex-col gap-2">
                  <Label className="mx-1">Upload Profile Picture</Label>
                  <Input
                    accept="image/*"
                    type="file"
                    onChange={changeFileHandler}
                    className="max-w-fit cursor-pointer"
                  />
                </div>
              </div>

              {loading ? (
                <Button className="w-full cursor-pointer bg-[#3A506B] text-[#e9ecf0]">
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
              <Link to="/login" className="text-blue-600 hover:text-blue-800">
                Login
              </Link>
            </p>
          </form>
        )}

        {/* ── STEP 2: OTP Screen ── */}
        {step === 2 && (
          <form
            onSubmit={verifyOtpHandler}
            className="flex flex-col gap-y-5 w-1/2 border border-gray-200 rounded-md my-10 p-8"
          >
            <div className="text-center">
              <h1 className="text-2xl font-bold">Verify your Email</h1>
              <p className="text-gray-500 text-sm mt-2">
                We sent a 6-digit OTP to{" "}
                <span className="font-medium text-gray-700">
                  {registeredEmail}
                </span>
              </p>
              <p className={`text-xs mt-1 ${timeLeft <= 30 ? "text-red-500 font-medium" : "text-gray-400"}`}>
                {timeLeft > 0
                  ? `Expires in 0:${String(timeLeft).padStart(2, "0")}`
                  : "OTP expired"}
              </p>
            </div>

            <div className="flex flex-col gap-y-1">
              <Label>Enter OTP</Label>
              <Input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="e.g. 483921"
                className="text-center text-lg tracking-widest"
              />
            </div>

            {loading ? (
              <Button className="w-full cursor-pointer bg-[#3A506B] text-[#e9ecf0]">
                Verifying...
              </Button>
            ) : (
              <Button
                type="submit"
                variant="ghost"
                className="w-full hover:text-[#3A506B] hover:bg-[#b1b4b8] cursor-pointer bg-[#3A506B] text-[#e9ecf0] hover:font-semibold"
              >
                Verify & Create Account
              </Button>
            )}

            {/* Resend — sirf tab jab timer 0 ho */}
            {timeLeft === 0 && (
              <p className="text-center text-sm">
                Didn't receive it?{" "}
                {resendLoading ? (
                  <span className="text-gray-400">Sending...</span>
                ) : (
                  <button
                    type="button"
                    onClick={resendOtpHandler}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Resend OTP
                  </button>
                )}
              </p>
            )}

            <p className="text-center text-sm text-gray-400">
              Wrong email?{" "}
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setOtp("");
                  setTimeLeft(60);
                }}
                className="text-blue-600 hover:text-blue-800"
              >
                Go back
              </button>
            </p>
          </form>
        )}

      </div>
    </>
  );
};

export default Register;
