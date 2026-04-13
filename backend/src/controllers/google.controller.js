import { User } from "../models/user.model.js";
import { generateAccessAndRefreshTokens } from "./user.controller.js";

const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
});

/**
 * Called after Passport has authenticated the user via Google.
 * Generates JWT tokens and redirects to the frontend with the accessToken.
 */
const googleAuthCallback = async (req, res) => {
  try {
    const user = req.user; // Injected by Passport

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user._id
    );

    // Option A: Redirect to frontend — frontend reads token from query param
    // and stores it (memory / state). The refreshToken lives in httpOnly cookie.
    return res
      .status(200)
      .cookie("refreshToken", refreshToken, cookieOptions())
      .redirect(
        `${process.env.FRONTEND_URL}/auth/success?token=${accessToken}`
      );
  } catch (err) {
    console.error("Google auth callback error:", err);
    return res.redirect(`${process.env.FRONTEND_URL}/auth/failure`);
  }
};

export { googleAuthCallback };
