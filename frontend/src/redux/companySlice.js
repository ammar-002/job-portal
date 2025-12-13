import { createSlice } from "@reduxjs/toolkit";
const companySlice = createSlice({
  name: "company",
  initialState: {
    SingleCompany: null,
    AllCompanies: [],
    searchCompanyByText: "",
  },
  reducers: {
    setSingleCompany: (state, action) => {
      state.SingleCompany = action.payload;
    },
    setAllCompanies: (state, action) => {
      state.AllCompanies = action.payload;
    },
    setSearchCompanyByText:(state,action)=>{
      state.searchCompanyByText = action.payload
    }
  },
});

export const { setSingleCompany, setAllCompanies,setSearchCompanyByText } = companySlice.actions;
export default companySlice.reducer;
