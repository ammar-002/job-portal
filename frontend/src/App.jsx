import React from "react";
import Navbar from "./components/shared/Navbar";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Home from "./components/HomePage/Home";
import Jobs from "./components/JobsPage/Jobs";
import Browse from "./components/BrowsePage/Browse";
import Profile from "./components/ViewProfilePage/Profile";
import ViewDetails from "./components/JobsPage/ViewDetails";
import Companies from "./admin/Companies";
import NewCompany from "./admin/NewCompany";
import AdminJobs from "./admin/AdminJobs";
import CompanySetup from "./admin/CompanySetup";
import NewJob from "./admin/NewJob";
import Applicants from "./admin/Applicants";
import ProtectedRoute from "./admin/Protect";
const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/jobs",
    element: <Jobs />,
  },
  {
    path: "/browse",
    element: <Browse />,
  },
  {
    path: "/view-profile",
    element: <Profile />,
  },
  {
    path: "/jobs/job-details/:id",
    element: <ViewDetails />,
  },
  {
    path: "/admin/companies",
    element: <ProtectedRoute><Companies /></ProtectedRoute>,
  },
  {
    path: "/admin/companies/:id",
    element:  <ProtectedRoute><CompanySetup /></ProtectedRoute> ,
  },
  {
    path: "/admin/new-company",
    element: <ProtectedRoute><NewCompany /></ProtectedRoute>,
  },
  {
    path: "/admin/jobs",
    element: <ProtectedRoute><AdminJobs /></ProtectedRoute>,
  },
  {
    path: "/admin/jobs/:id/applicants",
    element: <ProtectedRoute><Applicants /></ProtectedRoute>,
  },
  {
    path: "admin/jobs/new",
    element: <ProtectedRoute><NewJob /></ProtectedRoute>,
  },
]);

const App = () => {
  return (
    <>
      <RouterProvider router={appRouter}></RouterProvider>
    </>
  );
};

export default App;
