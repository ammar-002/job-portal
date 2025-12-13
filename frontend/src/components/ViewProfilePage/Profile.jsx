import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import { Avatar, AvatarImage } from "../ui/avatar";
import { FaPhoneAlt, FaTools } from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import { Badge } from "../ui/badge";
import { MdEdit } from "react-icons/md";
import { ImProfile } from "react-icons/im";
import AppliedJobsTable from "./AppliedJobsTable";
import EditForm from "./EditForm";
import { useSelector } from "react-redux";

const Profile = () => {
  const { user } = useSelector((store) => store.auth);
  const skills = user?.profile?.skills || [];
  const isResume = Boolean(user?.profile?.resume);

  const [open, setOpen] = useState(false);

  return (
    <div>
      <Navbar />
      <div className="profile shadow-md max-w-[90vw] md:max-w-[70vw] bg-gray-100 mx-auto mt-10 p-5  rounded-xl flex flex-col gap-5">
        <div className="flex gap-3 items-center">
          <Avatar className={"w-20 h-20"}>
            <AvatarImage
              src={
                user?.profile?.profilePic
                  ? user.profile.profilePic
                  : "https://github.com/shadcn.png"
              }
              alt="@shadcn"
            />
          </Avatar>
          <div>
            <p className="font-semibold text-lg">{user?.fullName}</p>
            <p className="font-normal text-md">{user?.profile?.bio}</p>
          </div>
          <div
            onClick={() => setOpen(true)}
            className="rounded-full bg-gray-300 p-2 text-xl ml-10 mb-10 cursor-pointer"
          >
            <MdEdit />
          </div>
        </div>

        <div className="email flex items-center gap-3">
          <div className="rounded-full bg-gray-300 p-2">
            <SiGmail />
          </div>
          <p>{user?.email}</p>
        </div>
        <div className="phone flex items-center gap-3">
          <div className="rounded-full bg-gray-300 p-2">
            <FaPhoneAlt />
          </div>
          <p>{user?.phoneNumber}</p>
        </div>

        <div className="skills flex gap-3 items-center">
          <div className="rounded-full bg-gray-300 p-2">
            <FaTools />
          </div>
          {skills.length == 0 ? (
            <span>NA</span>
          ) : (
            <div className="flex gap-3">
              {user?.profile?.skills.map((item, index) => (
                <Badge
                  key={index}
                  className={"text-sm font-semibold bg-blue-900 text-white"}
                >
                  {item}
                </Badge>
              ))}
            </div>
          )}
        </div>
        <div className="flex gap-3 items-center">
          <div className="rounded-full bg-gray-300 p-2 ">
            <ImProfile />
          </div>
          {isResume ? (
            <a
              href={`${user?.profile?.resume}`}
              target="_blank"
              className="text-blue-800 font-semibold hover:text-blue-700 hover:font-semibold"
            >
              {user?.profile?.resumeOriginalName}
            </a>
          ) : (
            <span>NA</span>
          )}
        </div>
        <div className="bg-white">
          <EditForm open={open} setOpen={setOpen} />
        </div>
      </div>

      <div>
        <span className="text-3xl font-bold text-gray-500 flex justify-center mt-10">
          Your Applied Jobs
        </span>
        <AppliedJobsTable />
      </div>
    </div>
  );
};

export default Profile;
