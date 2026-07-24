import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import getDataUri from "../utils/dataURI.js";
import cloudinary from "../utils/cloudinary.js";
import { profile } from "console";
import {generateTokens, setTokenCookie, blacklistToken,isBlacklisted} from "../utils/tokens.js";


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials", success: false });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials", success: false });
    }

    const { accessToken, refreshToken } = await generateTokens(user._id.toString());
    // console.log(accessToken,refreshToken)
    setTokenCookie(res, accessToken, refreshToken);

    return res.status(200).json({
      message: `Welcome back ${user.fullName}`,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber:user.phoneNumber,
        role: user.role,
        profile: user.profile,
      },
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};


export const register = async (req, res) => {
  try {
    const { fullName, email, password, phoneNumber, role } = req.body;
    if (!fullName || !email || !password || !phoneNumber || !role) {
      return res.status(400).json({
        message: "Something is Missing!!",
        success: false,
      });
    }
    const file = req.file;
    let cloudResponse;
    if (req.file) {
      const fileUri = getDataUri(file);
      cloudResponse = await cloudinary.uploader.upload(fileUri.content);
    }
    if (!cloudResponse) {
      return res.status(400).json({
        message: "Profile Picture is required",
        success: false,
      });
    }
    const isEmailExist = await User.findOne({ email });
    if (isEmailExist) {
      return res.status(400).json({
        message: "Email exists already!",
        success: false,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 8);

    const user= await User.create({
      fullName,
      email,
      password: hashedPassword,
      phoneNumber,
      role,
      profile:{
        profilePic: cloudResponse.secure_url
      }
    });
    return res.status(201).json({
      message: "user created successfully",
      success: true,
      user
    });
  } catch (error) {
    // console.log(error);
    return res.status(500).json({
      message: "Something Wrong Happened!",
      success: false,
    });
  }
};



export const logout = async (req, res) => {
  try {
    const { accessToken, refreshToken } = req.cookies;
    await blacklistToken(accessToken);
    await blacklistToken(refreshToken);
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return res.status(200).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullName, email, bio, phoneNumber, skills } = req.body;
    const file = req.file;
    let cloudResponse;
    if (req.file) {
      const fileUri = getDataUri(req.file);
      cloudResponse = await cloudinary.uploader.upload(fileUri.content);
    }
    const skillsArray = skills ? skills.split(",") : [];
    const userId = req._id;  //come from middleware authentication
    let user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        message: "User Not Found",
        success: false,
      });
    }
    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio) user.profile.bio = bio;
    if (skills) user.profile.skills = skillsArray;
    // resume comes later
    if (cloudResponse) {
      user.profile.resume = cloudResponse.secure_url;
      user.profile.resumeOriginalName = file.originalname;
    }

    await user.save();

    user = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      profile: user.profile,
      role:user.role
    };
    return res.status(200).json({
      message: "profile updated successfully",
      user,
      success: true,
    });
  } catch (error) {
    // console.log(error);
    return res.status(500).json({
      message: "Something Wrong Happened!",
      success: false,
    });
  }
};



export const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token missing", success: false });
    }

    // Refresh token bhi blacklist ho sakta hai (logout ke baad)
    const blacklisted = await isBlacklisted(refreshToken);
    if (blacklisted) {
      return res.status(401).json({ message: "Session expired, please login", success: false });
    }

    const decoded =  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // Purana refresh token blacklist karo (rotation — security best practice)
    await blacklistToken(refreshToken);

    const { accessToken: newAccess, refreshToken: newRefresh } = await generateTokens(decoded.userId);
    setTokenCookie(res, newAccess, newRefresh);

    return res.status(200).json({ message: "Token refreshed", success: true });
  } catch (error) {
    return res.status(401).json({ message: "Invalid refresh token, please login again", success: false });
  }
};