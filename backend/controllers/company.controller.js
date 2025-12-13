import { Company } from "../models/company.model.js";
import getDataUri from "../utils/dataURI.js";
import cloudinary from "../utils/cloudinary.js";
export const registerCompany = async (req, res) => {
  try {
    const { companyName, logo } = req.body;
    if (!companyName) {
      return res.status(400).json({
        message: "Company Name Is Required.",
        success: false,
      });
    }
    let company = await Company.findOne({ companyName });
    if (company) {
      return res.status(400).json({
        message: "Company Already Exist With This Name",
        success: false,
      });
    }
    company = await Company.create({
      companyName: companyName,
      logo: logo,
      userId: req._id,
    });
    return res.status(201).json({
      message: "Company Registered Successfully!",
      success: true,
      company,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something Went Wrong!",
      success: false,
    });
  }
};

// Get Companies of Logged In User
export const getCompanies = async (req, res) => {
  try {
    const userId = req._id;
    const companies = await Company.find({ userId });
    if (!companies) {
      return res.status(400).json({
        message: "Companies Not Found",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Companies Found",
      companies,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "SOmething Went Wrong!",
      success: false,
    });
  }
};
// Getting Company By Id
export const getCompanyById = async (req, res) => {
  try {
    const companyId = req.params._id;
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(400).json({
        message: "Company Not Found",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Company Found.",
      company,
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

export const updateCompany = async (req, res) => {
  try {
    const { companyName, description, website, location } = req.body;

    const file = req.file;
    let logo;
    let cloudResponse;
    if (req.file) {
      const fileUri = getDataUri(file);
      cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      logo = cloudResponse.secure_url;
    }
    const updateData = { companyName, description, website, location, logo };
    const company = await Company.findByIdAndUpdate(
      req.params._id,
      updateData,
      { new: true }
    );
    if (!company) {
      return res.status(404).json({
        message: "Company Not Found!",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Company Data Updated Successfully!",
      company,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something Went Wrong in Company!",
      success: false,
    });
  }
};

export const deleteCompany = async (req, res) => {
  try {
    const companyId = req.params._id;
    const deleteCompany = await Company.findByIdAndDelete(companyId);
    if (!deleteCompany) {
      return res.status(400).json({
        message: "Company Not Found",
        success: false,
      });
    }
    return res.status(201).json({
      message: "Comapany Deleted Successfully",
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
