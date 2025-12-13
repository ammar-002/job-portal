import mongoose, { mongo } from "mongoose";
const applicationSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'Job'
    },
    applicant : {
        type: mongoose.Schema.Types.ObjectId,
        required : true,

    },
      status:{
        type:String,
        enum:['pending', 'accepted', 'rejected'],
        default:'pending'
    }

},{timestamps:true})

export const application = mongoose.model("application",applicationSchema) 