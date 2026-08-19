import { createSlice } from "@reduxjs/toolkit";
import reducer from "./authSlics";

const jobSlice = createSlice({
  name: "job",
  initialState: {
    allJobs: [],
    singleJob: null,
    searchJobByText: "",
    AllAdminJobs: [],
    singleAdminJob: null,
    AppliedJobs: [],
    currentPage: 1,
    totalPages: 1,
    totalJobs: 0,
  },
  reducers: {
    setAllJobs: (state, action) => {
      state.allJobs = action.payload;
    },
    setJobsPagination: (state, action) => {
      state.currentPage = action.payload.currentPage;
      state.totalPages = action.payload.totalPages;
      state.totalJobs = action.payload.totalJobs;
    },
    setSingleJob: (state, action) => {
      state.singleJob = action.payload;
    },
    setSingleAdminJob: (state, action) => {
      state.singleAdminJob = action.payload;
    },
    setSearchJobByText: (state, action) => {
      state.searchJobByText = action.payload;
    },
    setAllAdminJobs: (state, action) => {
      state.AllAdminJobs = action.payload;
    },
    setAppliedJobs: (state, action) => {
      state.AppliedJobs = action.payload;
    },
    
  },
});

export const {
  setAllJobs,
  setSingleJob,
  setSearchJobByText,
  setAllAdminJobs,
  setSingleAdminJob,
  setAppliedJobs,
  setSearchedQuery,
  setJobsPagination
} = jobSlice.actions;
export default jobSlice.reducer;
