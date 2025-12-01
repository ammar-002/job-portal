import mongoose, { Schema } from "mongoose";
const companySchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    location : {
        type : String,
    },
    website : {
        type : String,
    },
    logo : {
        type : String,
        
    },
    userId: {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }
},{timestamps : true })
export const Company = mongoose.model("Company", companySchema)