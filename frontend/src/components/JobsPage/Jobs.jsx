import React from "react";
import Navbar from "../shared/Navbar";
import JobsFilter from "./JobsFilter";
import SingleJob from "./SingleJob";
import { useSelector } from "react-redux";
import useGetAllJobs from "../hooks/useGetAllJobs";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";
import { useSearchParams } from "react-router-dom";

const Jobs = () => {
  const { allJobs, totalPages, totalJobs } = useSelector((store) => store.job);
  const [searchParams, setSearchParams] = useSearchParams();

  useGetAllJobs();

  const currentPageNum = parseInt(searchParams.get("page")) || 1;

  const goToPage = (pageNum) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNum);
    setSearchParams(params);
  };

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
              {allJobs.length > 0 ? (
                allJobs.map((item) => (
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
                onClick={() => goToPage(currentPageNum - 1)}
              >
                Previous
              </Button>
              <span className="text-sm font-medium">
                Page {currentPageNum} of {totalPages} ({totalJobs} jobs)
              </span>
              <Button
                disabled={currentPageNum === totalPages}
                onClick={() => goToPage(currentPageNum + 1)}
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