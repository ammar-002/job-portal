import mongoose from "mongoose";
const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    requirements: [{
        type: String,
        require: true
    }],
    salary: {
        type: Number,
        require: true

    },
    experience: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true
    },
    vacancies: {
        type: Number,
        required: true
    },

    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    created_byId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    applications:[ {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'application',

    }]

}, { timestamps: true })

export const Job = mongoose.model("Job", jobSchema)