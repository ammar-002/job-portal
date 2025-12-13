import React, { useEffect } from "react";
import Navbar from "../shared/Navbar";
import HeroSection from "./HeroSection";
import CarasoulSection from "./CarasoulSection";
import LatestJobs from "./LatestJobs";
import Footer from "../shared/Footer";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  useEffect(() => {
    if (user?.role === "recruiter") {
      navigate("/admin/companies");
    }
  }, []);
  return (
    <div>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <HeroSection />
        <CarasoulSection />
        <LatestJobs />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
