import { setSearchedQuery } from "@/redux/jobSlice";
import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";


const HeroSection = () => {
  const dispatch  = useDispatch()
  const navigate = useNavigate()
  const [query,setQuery] = useState("")
  const clickHandle = ()=>{
    dispatch(setSearchedQuery(query))
    navigate("/browse")
  }
  return (
    <div>
      <div className="flex flex-col items-center justify-center my-[3vh] gap-4">
        <p className="text-lg bg-gray px-2 py-1 rounded-lg bg-gray-50 text-[#3A506B]  ">Welcome To <span className="font-semibold">Do!Job</span></p>
        <div className="text-3xl text-[#3A506B] text-center font-bold">
          Land Your Dream Job & <br />{" "}
          <span className="text-[#b1b4b8]">Launch the Career You Deserve!</span>{" "}
        </div>
        
        <div className="search flex items-center  justify-center mt-5 shadow-md shadow-gray-300 rounded-full ">
          <input onChange={(e)=>setQuery(e.target.value)} placeholder="Search Job......" type="text"  className="text-lg rounded-l-full font-semibold outline-none py-2  pl-5 text-[#3A506B] bg-gray-100 w-[60vw] md:w-[30vw] "/>
          <div onClick={clickHandle} className="cursor-pointer py-3 px-5 bg-[#3A506B] rounded-r-full text-[#b1b4b8]"><FaSearch className="text-xl "/></div>
        </div>
      </div>
    </div>
  );
};
export default HeroSection;
