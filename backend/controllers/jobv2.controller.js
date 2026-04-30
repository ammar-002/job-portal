import {Job} from '../models/job.model.js'
export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || ""
        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } }


            ]
        }

        // We populate companyId to see company details in which job posted
        const jobs = await Job.find(query).populate({
            path:"companyId"
        }).sort({createdAt:-1})
        if (!jobs) {
            return res.status(404).json({
                message: "Jobs Not Found",
                success: false,
            })
        }
        return res.status(200).json({
            message: "Jobs Found.",
            jobs,
            success:true
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Something Went Wrong!",
            success: false,
        })
    }
}
