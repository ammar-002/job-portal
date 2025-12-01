import React, { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import { Button } from "../ui/button";
const JobsFilter = () => {
  const [selectedVal, setSelectedVal] = useState("");
  const dispatch = useDispatch();
  const handleChange = (value) => {
    setSelectedVal(value);
  };
  useEffect(() => {
    // console.log(selectedVal);
    dispatch(setSearchedQuery(selectedVal));
  }, [selectedVal]);
  const filter = [
    {
      type: "Location",
      array: ["Karachi", "Hyderabad", "Larkana"],
    },
    {
      type: "Field",
      array: ["Development", "Designing", "Marketing"],
    },
    {
      type: "Salary",
      array: ["0-50K", "51K-100K", "100K+"],
    },
  ];
  return (
    <div className="w-[15vw] bg-gray-300 p-2 rounded-md min-h-[80vh] overflow-y-auto  ">
      <div className="text-center font-bold text-xl text-[#1C2541]">
        Filter Jobs
        <hr />
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2 mt-3">
          {filter.map((data, index) => (
            <div key={index} className="font-semibold text-lg mt-2">
              {data.type}
              <RadioGroup
                value={selectedVal}
                onValueChange={handleChange}
                className={"mt-3"}
              >
                {data.array.map((item, index2) => (
                  <div key={index2} className="flex items-center gap-3 ">
                    <RadioGroupItem
                      value={`${item}`}
                      id={`${data.type.toLowerCase()}-${index2}`}
                    />
                    <Label htmlFor={`${data.type.toLowerCase()}-${index2}`}>
                      {item}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ))}
          <Button
            onClick={() => dispatch(setSearchedQuery(""))}
            className={"bg-black text-white mt-1 w-14 cursor-pointer "}
          >
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JobsFilter;
