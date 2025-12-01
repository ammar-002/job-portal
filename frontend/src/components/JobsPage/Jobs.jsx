import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import JobsFilter from "./JobsFilter";
import SingleJob from "./SingleJob";
import { useSelector } from "react-redux";
import store from "@/redux/store";
import useGetAllJobs from "../hooks/useGetAllJobs";
import { motion } from "framer-motion";

const Jobs = () => {
  const { allJobs, searchedQuery } = useSelector((store) => store.job);
  useGetAllJobs();
  const [tempJobs, setTempJobs] = useState(allJobs);
  useEffect(() => {
    if (searchedQuery) {
      const filteredJobs = allJobs.filter((job) => {
        return (
          job.title.toLowerCase().includes(searchedQuery.toLowerCase()) ||
          job.description.toLowerCase().includes(searchedQuery.toLowerCase()) ||
          job.location.toLowerCase().includes(searchedQuery.toLowerCase())
        );
      });
      setTempJobs(filteredJobs);
    } else {
      setTempJobs(allJobs);
    }
  }, [allJobs, searchedQuery]);
  return (
    <div className="">
      <Navbar />
      <div className=" max-w-7xl mx-auto p-4 ">
        <div className="flex ">
          <div className="w-[20%]">
            <JobsFilter />
          </div>

          <div className="grid grid-col gap-10 md:grid-cols-2 lg:grid-cols-3 h-[80vh] overflow-y-auto overflow-x-hidden  p-4 ">
            {tempJobs.map((item) => (
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
                key={item._id}
              >
                <SingleJob job={item} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
