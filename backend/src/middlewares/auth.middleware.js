import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";

/**
 * Protects routes by verifying the Bearer access token.
 * Attaches the authenticated user to req.user on success.
 */
const authenticateUser = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: User not found" });
    }

    req.user = user;
    next();
  } catch {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized: Invalid token" });
  }
});

export default authenticateUser;
