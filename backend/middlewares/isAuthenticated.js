import jwt from "jsonwebtoken";
import { isBlacklisted } from "../utils/tokens.js";
// MiddleWare
const isAuthenticated = async (req, res, next) => {
  try {
    const token = req?.cookies?.accessToken;
    if (!token) {
      return res.status(401).json({
        message: "Access Token Missing!",
        code: "TOKEN_EXPIRED",
        success: false,
      });
    }
    const blacklisted = await isBlacklisted(token);
    if (blacklisted) {
      return res.status(401).json({
        message: "You have been logged out. Please log in again.",
        success: false,
      });
    }

    const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req._id = decode.userId; // it will be used in the controller by using req._id
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({
          message: "Your session has expired. Please log in again.",
          success: false,
          code: "TOKEN_EXPIRED",
        });
    }
    return res.status(401).json({ message: "Invalid token", success: false });
  }
};

export default isAuthenticated;
