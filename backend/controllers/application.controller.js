import { application } from '../models/application.model.js'
import {Job} from '../models/job.model.js'
export const postapplication = async (req, res) => {
    try {
        const jobId = req.params._id
        const userId = req._id
        if (!jobId) {
            return res.status(400).json({
                message: "Job ID is required.",
                success: false,
            })
        }
        // check if the user has already applied for the job 
        const existingapplication = await application.findOne({ job: jobId, applicant: userId })
        if (existingapplication) {
            return res.status(400).json({
                message: "You Have Already Applied For This Job",
                success: false,
            })
        }
        // check if the job exist or not
        const job = await Job.findById(jobId)
        if (!job) {
            return res.status(404).json({
                message: "Job Not Found.",
                success: false,
            })
        }

        // Create a new application
        const newApplication = await application.create({
            job: jobId,
            applicant: userId
        })
        job.applications.push(newApplication._id)
        await job.save()
        return res.status(201).json({
            message: "Job Applied Successfully",
            newApplication,
            success: true,
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Something Went Wrong!",
            success: false,
        })

    }
}

export const getAppliedJobs = async (req, res) => {
    try {
        const userId = req._id;
        const all_application = await application.find({ applicant: userId }).sort({ createdAt: -1 }).populate({
            path: 'job',
            options: { sort: { createdAt: -1 } },
            populate: {
                path: 'companyId',  // Ensure this is 'companyId'
                options: { sort: { createdAt: -1 } }
            }
        });


        if (!all_application) {
            return res.status(400).json({
                message: "No Applications",
                success: false,
            })
        }
        return res.status(200).json({
            message: "Application Found",
            all_application,
            success: true
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Something Went Wrong!",
            success: false,
        })

    }
}
// Admin will see no of applicants(users applied)
export const getApplicants = async (req,res)=>{
    try {
        const jobId = req.params._id
        const jobs = await Job.findById(jobId).populate({
            path:'applications',
            options:{sort:{createdAt:-1}},
            populate:{
                path:'applicant',
                 model: 'User' ,
                // options:{sort:{createdAt:-1}},
            }
        })
        if(!jobs){
            return res.status(400).json({
                message:"Can Not Find Any Job",
                success:false,
            })
        }
        return res.status(200).json({
            message:"Jobs Found",
            success:true,
            jobs,
        })


    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message:"Something Went Wrong",
            success:false,
        })
    }
}

export const updateStatus = async (req,res)=>{
    try {
        const {status} = req.body
        const applicationId = req.params._id
        if(!status){
            return res.status(400).json({
                message:"Status Is Required",
                success: false
            })
        }
        // Find the Application by applicantId
        const find_application = await application.findOne({_id: applicationId})
        if(!find_application){
            return res.status(400).json({
                message:"Application Not Found",
                success:false
            })
        }
        // updating status
        find_application.status = status.toLowerCase()
        await find_application.save()
        return res.status(200).json({
            message:"Status Updated Successfully",
            success: true
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message:"Something Went Wrong",
            success:false,
        })
    }

}


