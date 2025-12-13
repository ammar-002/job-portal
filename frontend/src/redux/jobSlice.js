import { createSlice } from "@reduxjs/toolkit";
import reducer from "./authSlics";

const jobSlice = createSlice({
  name: "job",
  initialState: {
    allJobs: [],
    singleJob:null,
    searchJobByText:"",
    AllAdminJobs:[],
    singleAdminJob:null,
    AppliedJobs:[],
    searchedQuery:"",
  },
  reducers: {
    setAllJobs: (state, action) => {
      state.allJobs = action.payload;
    },
    setSingleJob: (state, action) => {
      state.singleJob = action.payload;
    },
    setSingleAdminJob: (state, action) => {
      state.singleAdminJob = action.payload;
    },
    setSearchJobByText:(state,action)=>{
      state.searchJobByText =action.payload
    },
    setAllAdminJobs :(state,action)=>{
      state.AllAdminJobs =action.payload
    },
    setAppliedJobs:(state,action)=>{
      state.AppliedJobs = action.payload
    },
    setSearchedQuery :(state,action)=>{
      state.searchedQuery = action.payload
    }
  },
});

export const { setAllJobs,setSingleJob,setSearchJobByText,setAllAdminJobs,setSingleAdminJob,setAppliedJobs,setSearchedQuery } = jobSlice.actions;
export default jobSlice.reducer;
