import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import JobsFilter from "./JobsFilter";
import SingleJob from "./SingleJob";
import { useSelector, useDispatch } from "react-redux";
import useGetAllJobs from "../hooks/useGetAllJobs";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";

const Jobs = () => {
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const { allJobs, searchedQuery, totalPages, totalJobs } = useSelector((store) => store.job);

  useGetAllJobs(currentPageNum, 9);

  const [tempJobs, setTempJobs] = useState(allJobs);

  // Jab searchedQuery change ho, page 1 pe wapas jao
  useEffect(() => {
    setCurrentPageNum(1);
  }, [searchedQuery]);

  useEffect(() => {
    if (searchedQuery) {
      const query = searchedQuery.toLowerCase();

      const filteredJobs = allJobs.filter((job) => {
        if (query.startsWith("salary:")) {
          const match = query.match(/salary:(\d*)-(\d*)/);
          if (match) {
            const min = Number(match[1]) || 0;
            const max = Number(match[2]) || Infinity;
            return Number(job.salary) >= min && Number(job.salary) <= max;
          }
        }

        const experienceOptions = ["fresher", "1+ years", "3+ years", "4+ years"];
        if (experienceOptions.includes(query)) {
          return job.experience.toLowerCase() === query;
        }

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

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <Button
                disabled={currentPageNum === 1}
                onClick={() => setCurrentPageNum((prev) => prev - 1)}
              >
                Previous
              </Button>
              <span className="text-sm font-medium">
                Page {currentPageNum} of {totalPages} ({totalJobs} jobs)
              </span>
              <Button
                disabled={currentPageNum === totalPages}
                onClick={() => setCurrentPageNum((prev) => prev + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Jobs;