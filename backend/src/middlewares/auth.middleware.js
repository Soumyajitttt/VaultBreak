import { getAuth, clerkClient } from "@clerk/express";
import { User } from "../models/user.model.js";

export const requireAuth = (req, res, next) => {
  const { userId } = getAuth(req);
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized. Please sign in." });
  }
  req.userId = userId;
  next();
};

export const syncUser = async (req, res, next) => {
  try {
    const existing = await User.findById(req.userId);
    if (!existing) {
      const clerkUser = await clerkClient.users.getUser(req.userId);
      await User.create({
        _id: clerkUser.id,
        email: clerkUser.emailAddresses[0].emailAddress,
        fullname: `${clerkUser.firstName} ${clerkUser.lastName}`,
        username: clerkUser.username || clerkUser.emailAddresses[0].emailAddress.split("@")[0],
        avatar: clerkUser.imageUrl || "",
      });
    }
    next();
  } catch (err) {
    console.error("syncUser error:", err);
    res.status(500).json({ error: "Failed to sync user" });
  }
};
