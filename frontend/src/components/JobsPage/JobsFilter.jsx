import React, { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useSearchParams } from "react-router-dom";

const JobsFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const experienceOptions = ["Fresher", "1+ Years", "3+ Years", "4+ Years"];

  const selectedExperience = searchParams.get("experience") || "";
  const minSalary = searchParams.get("minSalary") || "";
  const maxSalary = searchParams.get("maxSalary") || "";

  // Experience radio change
  const handleExperienceChange = (value) => {
    const params = new URLSearchParams(searchParams);
    params.set("experience", value);
    params.delete("minSalary");
    params.delete("maxSalary");
    params.set("page", "1");
    setSearchParams(params);
  };

  // Salary input change
  const handleSalaryChange = (e) => {
    const { name, value } = e.target;
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    params.delete("experience");
    params.set("page", "1");
    setSearchParams(params);
  };

  const handleClear = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("experience");
    params.delete("minSalary");
    params.delete("maxSalary");
    params.set("page", "1");
    setSearchParams(params);
  };

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
            name="minSalary"
            value={minSalary}
            onChange={handleSalaryChange}
            placeholder="From"
            className="p-1 rounded border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-sm"
          />
          <input
            type="number"
            name="maxSalary"
            value={maxSalary}
            onChange={handleSalaryChange}
            placeholder="To"
            className="p-1 rounded border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-sm"
          />
        </div>
      </div>

      <Button
        onClick={handleClear}
        className="bg-black text-white mt-4 w-full cursor-pointer"
      >
        Clear
      </Button>
    </div>
  );
};

export default JobsFilter;