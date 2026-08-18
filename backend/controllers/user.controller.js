import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import getDataUri from "../utils/dataURI.js";
import cloudinary from "../utils/cloudinary.js";
import { profile } from "console";
import {generateTokens, setTokenCookie, blacklistToken,isBlacklisted} from "../utils/tokens.js";
import redis from "../utils/redis.js";
import sendEmail from "../utils/sendEmail.js";


export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

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
    // check for role
    if (user.role !== role) {
      return res.status(403).json({ message: "You are not authorized to access this resource", success: false });
    }
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
    console.log(error)
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const register = async (req, res) => {
  try {
    const { fullName, email, password, phoneNumber, role } = req.body;

    if (!fullName || !email || !password || !phoneNumber || !role) {
      return res.status(400).json({ message: "Something is Missing!!", success: false });
    }

    // Verified user already exists?
    const isEmailExist = await User.findOne({ email });
    if (isEmailExist) {
      return res.status(400).json({ message: "Email already registered!", success: false });
    }

    // Profile pic upload
    if (!req.file) {
      return res.status(400).json({ message: "Profile Picture is required", success: false });
    }
    const fileUri = getDataUri(req.file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 8);

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // User data alag key mein — 30 min TTL
    const pendingUser = {
      fullName,
      email,
      password: hashedPassword,
      phoneNumber,
      role,
      profilePic: cloudResponse.secure_url,
    };
    await redis.set(`pending_data:${email}`, JSON.stringify(pendingUser), "EX", 300);

    
    await redis.set(`pending_otp:${email}`, otp, "EX", 60);

    // Email bhejo
    await sendEmail(
      email,
      "Verify your Job Portal account",
      `<h2>Welcome ${fullName}!</h2>
       <p>Your verification code is:</p>
       <h1 style="letter-spacing: 8px;">${otp}</h1>
       <p>This code expires in 1 minutes.</p>`
    );

    return res.status(200).json({
      message: "OTP sent to your email. Please verify to complete registration.",
      success: true,
    });

  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Something Wrong Happened!", success: false });
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
    console.log(error);
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

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Pehle OTP key check karo
    const storedOtp = await redis.get(`pending_otp:${email}`);
    if (!storedOtp) {
      return res.status(400).json({
        message: "OTP expired. Please request a new one.",
        success: false,
      });
    }

    // OTP match karo
    if (storedOtp !== otp) {
      return res.status(400).json({
        message: "Incorrect OTP. Please try again.",
        success: false,
      });
    }

    // User data nikalo
    const pendingData = await redis.get(`pending_data:${email}`);
    if (!pendingData) {
      return res.status(400).json({
        message: "Session expired. Please register again.",
        success: false,
      });
    }

    const pendingUser = JSON.parse(pendingData);

    // MongoDB mein create karo
    await User.create({
      fullName: pendingUser.fullName,
      email: pendingUser.email,
      password: pendingUser.password,
      phoneNumber: pendingUser.phoneNumber,
      role: pendingUser.role,
      profile: { profilePic: pendingUser.profilePic },
    });

    // Dono keys delete karo
    await redis.del(`pending_data:${email}`);
    await redis.del(`pending_otp:${email}`);

    return res.status(201).json({
      message: "Email verified! Account created successfully.",
      success: true,
    });

  } catch (error) {
    return res.status(500).json({ message: "Something Wrong Happened!", success: false });
  }
};

export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    // OTP abhi active hai?
    const existingOtp = await redis.get(`pending_otp:${email}`);
    if (existingOtp) {
      const ttl = await redis.ttl(`pending_otp:${email}`);
      const minutesLeft = Math.ceil(ttl / 60);
      return res.status(400).json({
        message: `OTP already active. Try again in ${minutesLeft} minute(s).`,
        success: false,
      });
    }

    // User data abhi bhi hai?
    const pendingData = await redis.get(`pending_data:${email}`);
    if (!pendingData) {
      return res.status(400).json({
        message: "Session expired. Please register again.",
        success: false,
      });
    }

    const pendingUser = JSON.parse(pendingData);

    // Naya OTP generate karo
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await redis.set(`pending_otp:${email}`, otp, "EX", 60);

    // Email bhejo
    await sendEmail(
      email,
      "Your new OTP — Job Portal",
      `<h2>Hi ${pendingUser.fullName}!</h2>
       <p>Your new verification code is:</p>
       <h1 style="letter-spacing: 8px;">${otp}</h1>
       <p>This code expires in 1 minutes.</p>`
    );

    return res.status(200).json({
      message: "New OTP sent to your email.",
      success: true,
    });

  } catch (error) {
    return res.status(500).json({ message: "Something Wrong Happened!", success: false });
  }
};