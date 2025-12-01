import { createSlice } from "@reduxjs/toolkit";
const applicationSlice = createSlice({
    name:"application",
    initialState:{
        AllApplicants:[]
    },
    reducers:{
        setAllApplicants:(state,action)=>{
            state.AllApplicants =action.payload
        }
    }
})
export const {setAllApplicants} = applicationSlice.actions
export default applicationSlice.reducer