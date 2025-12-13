import React, { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import { Button } from "../ui/button";

const JobsFilter = () => {
  const [selectedExperience, setSelectedExperience] = useState(""); // Radio
  const [salaryRange, setSalaryRange] = useState({ from: "", to: "" }); // Salary
  const dispatch = useDispatch();

  const experienceOptions = ["Fresher", "1+ Years", "3+ Years", "4+ Years"];

  // Experience radio change
  const handleExperienceChange = (value) => {
    setSelectedExperience(value);
    setSalaryRange({ from: "", to: "" }); // Clear salary when experience selected
  };

  // Salary input change
  const handleSalaryChange = (e) => {
    const { name, value } = e.target;
    setSalaryRange((prev) => ({ ...prev, [name]: value }));
    setSelectedExperience(""); // Clear experience if typing salary
  };

  // Dispatch query whenever experience or salary changes
  useEffect(() => {
    if (salaryRange.from || salaryRange.to) {
      dispatch(setSearchedQuery(`salary:${salaryRange.from}-${salaryRange.to}`));
    } else if (selectedExperience) {
      dispatch(setSearchedQuery(selectedExperience));
    } else {
      dispatch(setSearchedQuery(""));
    }
  }, [selectedExperience, salaryRange]);

  return (
    <div className="w-60 bg-gray-300 p-4 rounded-md min-h-[80vh] overflow-y-auto">
      <div className="text-center font-bold text-xl text-[#1C2541] mb-3">
        Filter Jobs
        <hr className="mt-2" />
      </div>

      {/* Experience Radio */}
      <div className="font-semibold text-lg">
        Experience
        <RadioGroup
          value={selectedExperience}
          onValueChange={handleExperienceChange}
          className="mt-3"
        >
          {experienceOptions.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 mt-2">
              <RadioGroupItem value={item} id={`exp-${idx}`} />
              <Label htmlFor={`exp-${idx}`}>{item}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Salary Inputs */}
      <div className="font-semibold text-lg mt-5">
        Salary
        <div className="flex flex-col gap-2 mt-2">
          <input
            type="number"
            name="from"
            value={salaryRange.from}
            onChange={handleSalaryChange}
            placeholder="From"
            className="p-1 rounded border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-sm"
          />
          <input
            type="number"
            name="to"
            value={salaryRange.to}
            onChange={handleSalaryChange}
            placeholder="To"
            className="p-1 rounded border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-sm"
          />
        </div>
      </div>

      <Button
        onClick={() => {
          setSelectedExperience("");
          setSalaryRange({ from: "", to: "" });
          dispatch(setSearchedQuery(""));
        }}
        className="bg-black text-white mt-4 w-full cursor-pointer"
      >
        Clear
      </Button>
    </div>
  );
};

export default JobsFilter;
