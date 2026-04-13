import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/user.model.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value?.toLowerCase();

        if (!email) {
          return done(new Error("No email found in Google profile"), null);
        }

        // 1. Already linked with Google → return the user
        let user = await User.findOne({ googleId: profile.id });
        if (user) return done(null, user);

        // 2. Email already registered manually → link Google to that account
        user = await User.findOne({ email });
        if (user) {
          user.googleId = profile.id;
          if (!user.avatar) user.avatar = profile.photos?.[0]?.value;
          await user.save({ validateBeforeSave: false });
          return done(null, user);
        }

        // 3. Brand new user → create account (no password needed)
        const baseUsername = email.split("@")[0].replace(/[^a-z0-9_]/gi, "");
        const username = `${baseUsername}_${Date.now()}`.toLowerCase();

        user = new User({
          fullname: profile.displayName,
          email,
          username,
          googleId: profile.id,
          avatar: profile.photos?.[0]?.value,
        });

        await user.save();
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

export default passport;
