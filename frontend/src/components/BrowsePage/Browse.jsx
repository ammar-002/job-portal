import React, { useEffect } from "react";
import Navbar from "../shared/Navbar";
import SingleJob from "../JobsPage/SingleJob";
import Footer from "../shared/Footer";
import { useDispatch, useSelector } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import useGetAllJobs from "../hooks/useGetAllJobs";

const Browse = () => {
  useGetAllJobs()
 const {allJobs} = useSelector(store=>store.job)
 const dispatch = useDispatch()
 useEffect(() => {
   return ()=>{
    dispatch(setSearchedQuery(""))
   }
 }, [])
 
  return (
    <div>
      <Navbar />
      <div className="max-w-[72vw] mx-auto min-h-[78vh] pt-10 ">
        <div className="font-bold text-xl text-gray-500  mt-5   ">
          <div className="">Search Results: ({allJobs?.length})</div>
        </div>
        <div className="jobs grid grid-col gap-10 md:grid-cols-2 lg:grid-cols-3 mb-2 ">
          {allJobs.map((item) => (
            <SingleJob key={item._id} job={item} />
          ))}
        </div>
      </div>
     <div className=""> <Footer/></div>
    </div>
  );
};

export default Browse;
