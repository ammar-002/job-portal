import React from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";

const CarasoulSection = () => {

    const categ = [
        "Frontend",
        "Backend",  
        "SEO",
        "Wordpress",
        "Mobile Development",
        "Data Science",
        "UI/UX Design",
        "DevOps",
        "Cloud Computing",
        "Cybersecurity",
        "Game Development",
        "Blockchain",
    ]
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const clickHandle = (item)=>{
        dispatch(setSearchedQuery(item))
        navigate("/browse")
      }
  return (
    <div className="">
      <div className="flex flex-col items-center justify-center  gap-1">
       
        <Carousel className="w-[50vw] md:w-60vw lg:w-[50vw] xl:w-[40vw] 2xl:w-[30vw] ">
          <CarouselContent className=" ">
            {
                categ.map((item, index) => (<CarouselItem onClick={()=>clickHandle(item)} key={index} className=" text-[#b1b4b8] text-center basis-1/1 md:basis-1/2 lg:basis-1/3"><Link>{item}</Link></CarouselItem>))
            }
            
          </CarouselContent>
          <CarouselPrevious className={"w-5 h-5"}/>
            <CarouselNext className={"w-5 h-5"}/>
        </Carousel>
      </div>
    </div>
  );
};

export default CarasoulSection;
