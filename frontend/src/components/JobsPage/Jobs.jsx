import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import JobsFilter from "./JobsFilter";
import SingleJob from "./SingleJob";
import { useSelector } from "react-redux";
import useGetAllJobs from "../hooks/useGetAllJobs";
import { motion, AnimatePresence } from "framer-motion";

const Jobs = () => {
  const { allJobs, searchedQuery } = useSelector((store) => store.job);
  useGetAllJobs();
  const [tempJobs, setTempJobs] = useState(allJobs);

  useEffect(() => {
    if (searchedQuery) {
      const query = searchedQuery.toLowerCase();

      const filteredJobs = allJobs.filter((job) => {
        // Salary filter
        if (query.startsWith("salary:")) {
          const match = query.match(/salary:(\d*)-(\d*)/);
          if (match) {
            const min = Number(match[1]) || 0;
            const max = Number(match[2]) || Infinity;
            return Number(job.salary) >= min && Number(job.salary) <= max;
          }
        }

        // Experience filter (radio match)
        const experienceOptions = ["fresher", "1+ years", "3+ years", "4+ years"];
        if (experienceOptions.includes(query)) {
          return job.experience.toLowerCase() === query;
        }

        // Default text search
        return (
          job.title.toLowerCase().includes(query) ||
          job.description.toLowerCase().includes(query) ||
          job.location.toLowerCase().includes(query)
        );
      });

      setTempJobs(filteredJobs);
    } else {
      setTempJobs(allJobs);
    }
  }, [allJobs, searchedQuery]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto p-4 flex gap-6">
        <div className="w-60 shrink-0">
          <JobsFilter />
        </div>

        <div className="flex-1 overflow-y-auto max-h-[80vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {tempJobs.length > 0 ? (
                tempJobs.map((item) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <SingleJob job={item} />
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center text-gray-500 mt-10">
                  No jobs found.
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
