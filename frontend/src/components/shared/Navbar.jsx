import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoIosLogOut } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "../utils/constant";
import { toast } from "sonner";
import { setUser } from "@/redux/authSlics";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(null));
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error)

    }
  };
  return (
    <div className="">
      <nav className="flex  justify-around bg-[#e9ecf0] p-2 items-center w-[] ">
        <div className="logo ">
          <Link to={"/"}>
            <h1 className="text-4xl font-bold text-[#3A506B]">
              Do <span className="text-[#1C2541]">Job</span>
            </h1>
          </Link>
        </div>
        <div className="options md:flex items-center gap-7 hidden ">
          {user?.role === "recruiter" ? (
            <ul className="flex gap-7 text-md">
              {" "}
              <li className="cursor-pointer font-semibold hover:text-[#3A506B]">
                <Link to={"/admin/companies"}>Companies</Link>
              </li>
              <li className="cursor-pointer font-semibold hover:text-[#3A506B]">
                <Link to={"/admin/jobs"}>Jobs</Link>
              </li>
            </ul>
          ) : (
            <ul className="flex gap-7 text-md  ">
              <li className="cursor-pointer font-semibold hover:text-[#3A506B]">
                <Link to={"/"}>Home</Link>
              </li>
              <li className="cursor-pointer font-semibold hover:text-[#3A506B]">
                <Link to={"/jobs"}>Jobs</Link>
              </li>

            </ul>
          )}
          {!user ? (
            <div className="flex gap-1">
              <Link to={"/login"}>
                <Button
                  variant="ghost"
                  className="hover:text-[#3A506B] hover:bg-[#b1b4b8] cursor-pointer bg-[#3A506B] text-[#e9ecf0] hover:font-semibold"
                >
                  Login
                </Button>
              </Link>
              <Link to={"/register"}>
                <Button
                  variant="ghost"
                  className="hover:text-[#3A506B] hover:bg-[#b1b4b8] cursor-pointer bg-[#3A506B] text-[#e9ecf0] hover:font-semibold"
                >
                  Register{" "}
                </Button>
              </Link>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage
                    src={
                      user?.profile?.profilePic
                        ? user.profile.profilePic
                        : "https://github.com/shadcn.png"
                    }
                    alt="@shadcn"
                  />
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="border-2 border-[#b1b4b8] bg-[#e9ecf0]">
                <div className="flex gap-2 items-center my-2 ">
                  <Avatar className="cursor-pointer">
                    <AvatarImage
                      src={
                        user?.profile?.profilePic
                          ? user.profile.profilePic
                          : "https://github.com/shadcn.png"
                      }
                      alt="@shadcn"
                    />
                  </Avatar>
                  <div className="img">
                    <h1 className="text-md">{user?.fullName}</h1>
                    <p className="text-sm font-extralight">
                      {user?.profile?.bio}
                    </p>
                  </div>
                </div>
                <div className="mx-3 p-1 space-y-2">
                  {/* View Profile */}
                  {user?.role === "student" && (
                    <div className="flex items-center gap-1 cursor-pointer hover:font-semibold">
                      <CgProfile className="text-xl" />
                      <span className="text-sm bg-[#e9ecf0] px-2 py-1 rounded">
                        <Link to={"/view-profile"}>View Profile</Link>
                      </span>
                    </div>
                  )}

                  {/* Logout */}
                  <div
                    onClick={logoutHandler}
                    className="flex items-center gap-1 cursor-pointer hover:font-semibold"
                  >
                    <IoIosLogOut className="text-red-600 text-xl" />
                    <span className="text-sm text-red-600 bg-[#e9ecf0] px-2 py-1 rounded">
                      Logout
                    </span>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
