import jwt from "jsonwebtoken";
import redis from "./redis.js";

export const generateTokens = async (userId) => {
  // console.log(userId)
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });
  
  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
  // console.log("Access: ",accessToken," Refresh: ",refreshToken)
  return { accessToken, refreshToken };
};

export const setTokenCookie = (res, accessToken, refreshToken) => {
  const isProduction = process.env.NODE_ENV === "production";
  res.cookie("accessToken", accessToken, {
    httpOnly: true, 
    secure: isProduction,
    sameSite: isProduction ? "None" : "Lax",
    maxAge: 1 * 60 * 1000, // 15 minutes
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "None" : "Lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const blacklistToken = async (token, expiry) => {
  try {
    const decoded = jwt.decode(token);
    if (!decoded?.exp) return;
    const ttl = decoded.exp - Math.floor(Date.now() / 1000);
    if (ttl > 0) {
      await redis.set(`bl:${token}`, "blacklisted", "EX", ttl);
    }
  } catch (error) {
    console.error("Error blacklisting token:", error);
  }
};

export const isBlacklisted  = async (token) => {
    const result = await redis.get(`bl:${token}`);
    return result === "blacklisted";
}