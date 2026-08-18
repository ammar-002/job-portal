import { Job } from "../models/job.model.js";
import redis from "../utils/redis.js";

// Create a new job posting (typically by an Admin/Recruiter).
export const createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      experience,
      location,
      vacancies,
      companyId,
    } = req.body;
    const userId = req._id;
    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !experience ||
      !location ||
      !vacancies ||
      !companyId
    ) {
      return res.status(400).json({
        message: "Something Is Missing, Fill All Fields",
        success: false,
      });
    }
    // Creating Job
    const job = await Job.create({
      title,
      description,
      requirements: requirements.split(","),
      salary: Number(salary),
      experience,
      location,
      vacancies,
      companyId,
      created_byId: userId,
    });
    const keys = await redis.keys("jobs:*");
    if (keys.length > 0) {
      await redis.del(...keys);
    }
    return res.status(201).json({
      message: "Job Created Successfully!",
      job,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something Went Wrong!",
      success: false,
    });
  }
};

// Get all available job postings(can be filtered by keyword).
// Typically accessible by Students / Job Seekers.
export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    const cachedKey = `jobs:${keyword}:page${page}:limit${limit}`;

    const cachedData = await redis.get(cachedKey);

    if (cachedData) {
      return res.status(200).json({
        ...JSON.parse(cachedData),
        success: true,
        source: "cache",
      });
    }

    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    };

    const jobs = await Job.find(query)
      .populate({ path: "companyId" })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalJobs = await Job.countDocuments(query);


    const responseData = {
      message: "Jobs Found.",
      jobs,
      currentPage: page,
      totalPages: Math.ceil(totalJobs / limit),
      totalJobs,
    };

    await redis.set(cachedKey, JSON.stringify(responseData), "EX", 60);
    return res.status(200).json({
      ...responseData,
      success: true,
      source: "db",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something Went Wrong!",
      success: false,
    });
  }
};

// Get a single job posting by its ID.
// Typically accessible by Students/Job Seekers to view job details.
export const getJobById = async (req, res) => {
  try {
    const jobId = req.params._id;
    const job = await Job.findById(jobId).populate({ path: "applications" });
    if (!job) {
      return res.status(404).json({
        message: "No Job Found.",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Job Found",
      job,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something Went Wrong!",
      success: false,
    });
  }
};

// This is a placeholder comment for a function that would
// count how many jobs an Admin/Recruiter has created so far.

export const getAdminJobs = async (req, res) => {
  try {
    const adminId = req._id;
    const jobs = await Job.find({ created_byId: adminId })
      .populate({
        path: "companyId",
      })
      .sort({ createdAt: -1 });
    if (!jobs) {
      return res.status(404).json({
        message: "No Job Posted Yet By Admin!",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Admin Jobs Found",
      jobs,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something Went Wrong!",
      success: false,
    });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const jobId = req.params._id;
    const job = await Job.findByIdAndDelete(jobId);
    if (!job) {
      return res.status(400).json({
        message: "Cannot Find Job",
        success: false,
      });
    }
    const keys = await redis.keys("jobs:*");
    if (keys.length > 0) {
      await redis.del(...keys);
    }
    return res.status(200).json({
      message: "Job Deleted Successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const updateJob = async (req, res) => {
  try {
    // console.log("Update Job Request Body:", req.body);
    const jobId = req.params._id;
    const {
      title,
      description,
      requirements,
      salary,
      experience,
      location,
      vacancies,
      companyId,
    } = req.body;
    if (!jobId) {
      return res.status(400).json({
        message: "Job ID is Required",
        success: false,
      });
    }
    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !experience ||
      !location ||
      !vacancies ||
      !companyId
    ) {
      return res.status(400).json({
        message: "Something Is Missing, Fill All Fields",
        success: false,
      });
    }
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        message: "No Job Found.",
        success: false,
      });
    }

    job.title = title;
    job.description = description;
    job.requirements = requirements.split(",");
    job.salary = Number(salary);
    job.experience = experience;
    job.location = location;
    job.vacancies = vacancies;
    job.companyId = companyId;
    await job.save();
    const keys = await redis.keys("jobs:*");
    if (keys.length > 0) {
      await redis.del(...keys);
    }
    return res.status(200).json({
      message: "Job Updated Successfully",
      job,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something Went Wrong!",
      success: false,
    });
  }
};
