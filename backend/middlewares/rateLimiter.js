import rateLimit from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import redis from "../utils/redis.js";

// Shared Options
const commonOptions = {
  standardHeaders: true,
  legacyHeaders: false,
};

// Redis Stores
const loginStore = new RedisStore({
  sendCommand: (...args) => redis.call(...args),
  prefix: "login:",
});

const registerStore = new RedisStore({
  sendCommand: (...args) => redis.call(...args),
  prefix: "register:",
});

const resendOtpStore = new RedisStore({
  sendCommand: (...args) => redis.call(...args),
  prefix: "resendOtp:",
});

const verifyOtpStore = new RedisStore({
  sendCommand: (...args) => redis.call(...args),
  prefix: "verifyOtp:",
});

// Login Limiter
export const loginLimiter = rateLimit({
  ...commonOptions,
  store: loginStore,
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3,
  message: {
    success: false,
    message: "Too many login attempts. Please try again after 15 minutes.",
  },
});

// Register Limiter
export const registerLimiter = rateLimit({
  ...commonOptions,
  store: registerStore,
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: {
    success: false,
    message: "Too many registration attempts. Please try again after 1 hour.",
  },
});

// Resend OTP Limiter
export const resendOtpLimiter = rateLimit({
  ...commonOptions,
  store: resendOtpStore,
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3,
  message: {
    success: false,
    message: "Maximum OTP resend attempts reached. Please try again after 15 minutes.",
  },
});

// Verify OTP Limiter
export const verifyOtpLimiter = rateLimit({
  ...commonOptions,
  store: verifyOtpStore,
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3,
  message: {
    success: false,
    message: "Maximum OTP verification attempts reached. Please try again after 15 minutes.",
  },
});