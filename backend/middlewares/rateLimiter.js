import rateLimit from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import redis from "../utils/redis.js";

// Separate Redis Stores
const loginStore = new RedisStore({
  sendCommand: (...args) => redis.call(...args),
  prefix: "login:",
});

const registerStore = new RedisStore({
  sendCommand: (...args) => redis.call(...args),
  prefix: "register:",
});


// Login Limiter
export const loginLimiter = rateLimit({
  store: loginStore,
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login attempts. Try again later in 15 mins.",
  },
});

// Register Limiter
export const registerLimiter = rateLimit({
  store: registerStore,
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many failed requests from this IP, try in 1 hour",
  },
});
