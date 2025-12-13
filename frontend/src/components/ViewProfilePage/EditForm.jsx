import React, { useState } from "react";
import axios from "axios";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { USER_API_END_POINT } from "../utils/constant";
import { setUser } from "@/redux/authSlics.js";
import { toast } from "sonner";

const EditForm = ({ open, setOpen }) => {
  const dispatch = useDispatch()
  const [loading, setloading] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const submitHandler = async (e)=>{
    e.preventDefault()
    setloading(true)
    const formData = new FormData()
    formData.append("fullName", input.fullName);
    formData.append("email", input.email);
    formData.append("bio", input.bio);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("skills", input.skills);
    if (input.file) {
      formData.append("file", input.file);
    }
    try {
      const res = await axios.post(`${USER_API_END_POINT}/updateprofile`,formData,{
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      })
      if(res.data.success){
        dispatch(setUser(res.data.user))  
        toast.success(res.data.message);
         
      }
    } catch (error) {
      // toast.error(error.response.data.message)
      console.log(error);
    }finally{
      setloading(false)
      setOpen(false)
    }
    console.log(input)
    

  }
   const changEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };
  const fileHandler = (e)=>{
     setInput({ ...input, file: e.target.files?.[0] });
    
  }
  const [input, setInput] = useState({
    fullName: user?.fullName,
    email: user?.email,
    phoneNumber: user?.phoneNumber,
    bio: user?.profile?.bio,
    skills: user?.profile?.skills.map((skill) => skill),
    file: user?.profile?.resume,
  });
  return (
    <div className="bg-white">
      <Dialog open={open} onOpenChange={setOpen}>
       
          <DialogContent
            className="sm:max-w-[400px] rounded-xl shadow-lg bg-white"
            onInteractOutside={() => setOpen(false)}
          >
             <form onSubmit={submitHandler} className="bg-white">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-gray-800">
                Edit Profile
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              {/* Name */}
              <div className="space-y-1">
                <Label htmlFor="name" className="text-gray-700">
                  Name
                </Label>
                <Input
                onChange = {changEventHandler}
                name="fullName"
                  value={input.fullName}
                  
                  id="name"
                  className="border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>

              {/* Username */}
              <div className="space-y-1">
                <Label htmlFor="email" className="text-gray-700">
                  Email
                </Label>
                <Input
                onChange = {changEventHandler}
                name = "email"
                value = {input.email}
                  id="email"
                  className="border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="phone" className="text-gray-700">
                  Phone No
                </Label>
                <Input
                onChange = {changEventHandler}
                name="phoneNumber"
                value = {input?.phoneNumber}
                  id="phone"
                  className="border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="bio" className="text-gray-700">
                  Bio
                </Label>
                <Input
                name = "bio"
                value = {input?.bio}
                onChange = {changEventHandler}
                  id="bio"
                  className="border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="skills" className="text-gray-700">
                  Skills
                </Label>
                <Input
                onChange = {changEventHandler}
                  id="skills"
                  name = "skills"
                  value={input?.skills}
                  className="border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="file" className="text-gray-700">
                  Resume
                </Label>
                <Input
                  accept="application/pdf"
                  name = "file"
                  
                  onChange = {fileHandler}
                  id="file"
                  type="file"
                  className="border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 mt-6">
              <Button
                type="button"
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-700"
              >
                Cancel
              </Button>
              {loading ? (
                <Button type="submit" className=" hover:text-[#3A506B] hover:bg-[#b1b4b8] cursor-pointer bg-[#3A506B] text-[#e9ecf0] hover:font-semibold">
                  Please Wait...
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="ghost"
                  className=" hover:text-[#3A506B] hover:bg-[#b1b4b8] cursor-pointer bg-[#3A506B] text-[#e9ecf0] hover:font-semibold"
                >
                  Save
                </Button>
              )}
            </div>
            </form>
          </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditForm;
