const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const User = require("../models/userModel");
const Workout = require("../models/workoutModel");
const sendEmail = require("../middleware/sendEmail");
const crypto = require("crypto");

// Helper to create tokens
const createToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET, {
    expiresIn: process.env.AUTH_TOKEN_EXPIRES_IN_MS || "1d",
  });
};

module.exports = {
  signup_post: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Validation
      if (!email || !password) {
        return res.status(400).json({ error: "All fields must be filled" });
      }
      if (!validator.isEmail(email)) {
        return res.status(400).json({ error: "Please enter valid email address" });
      }
      const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{8,}$/;
      if (!passwordRegex.test(password)) {
        return res.status(400).json({ error: "Password not strong enough" });
      }

      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "Email already in use" });
      }

      // Hash password
      const salt = await bcrypt.genSalt(Number(process.env.SALT) || 10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user
      const username = email.split("@")[0];
      const user = await User.create({
        email,
        password: hashedPassword,
        username,
        account_status: "pending",
      });

      // Create confirmation token
      const confirmationToken = crypto.randomBytes(32).toString("hex");
      const hashedToken = crypto
        .createHash("sha256")
        .update(confirmationToken)
        .digest("hex");

      // Store token temporarily in user model
      user.confirmationToken = hashedToken;
      user.confirmationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 1 day
      await user.save();

      // Send email
      const confirmUrl = `${process.env.CLIENT_URL || "http://localhost:3000"}/confirm-account/${confirmationToken}`;
      await sendEmail(
        email,
        "Confirm your WorkoutMate account",
        { confirmUrl },
        "../templates/verifySignup.handlebars"
      );

      res.status(200).json({
        success: "Account created and pending confirmation. Please check your inbox.",
      });
    } catch (error) {
      console.error("Error in signup_post:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  verify_user: async (req, res) => {
    try {
      const { accountConfirmationToken } = req.params;
      const hashedToken = crypto
        .createHash("sha256")
        .update(accountConfirmationToken)
        .digest("hex");

      const user = await User.findOne({
        confirmationToken: hashedToken,
        confirmationTokenExpires: { $gt: Date.now() },
      });

      if (!user) {
        return res.status(400).json({ error: "Invalid or expired token" });
      }

      user.account_status = "active";
      user.confirmationToken = undefined;
      user.confirmationTokenExpires = undefined;
      await user.save();

      res.status(200).json({ success: "Account confirmed, you may log in" });
    } catch (error) {
      console.error("Error in verify_user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  login_post: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "All fields must be filled" });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: "Invalid email or password" });
      }
      if (user.account_status !== "active") {
        return res.status(400).json({ error: "Account not confirmed yet" });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(400).json({ error: "Invalid email or password" });
      }

      const token = createToken(user._id);
      res.cookie("token", token, {
        httpOnly: true,
        maxAge: process.env.AUTH_TOKEN_EXPIRES_IN_MS || 86400000,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      });

      res.status(200).json({
        username: user.username,
        profileImg: user.profile_image,
      });
    } catch (error) {
      console.error("Error in login_post:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  logout: async (req, res) => {
    res.cookie("token", "logout", {
      httpOnly: true,
      maxAge: 0,
    });
    res.status(200).json({ loggedOut: true });
  },

  user_update_patch: async (req, res) => {
    try {
      const { username, profileImg } = req.body;
      const user = await User.findById(req.user._id);

      if (!user) {
        return res.status(401).json({ error: "Not authorized" });
      }

      if (username) user.username = username;
      if (profileImg) user.profile_image = profileImg;

      await user.save();

      res.status(200).json({
        user: {
          username: user.username,
          profileImg: user.profile_image,
        },
        success: "Profile updated",
      });
    } catch (error) {
      console.error("Error in user_update_patch:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  user_deletion: async (req, res) => {
    try {
      // Delete all user's workouts first
      await Workout.deleteMany({ user_id: req.user._id });
      // Delete user
      await User.findByIdAndDelete(req.user._id);

      res.cookie("token", "logout", {
        httpOnly: true,
        maxAge: 0,
      });

      res.status(200).json({ success: "Account deleted successfully" });
    } catch (error) {
      console.error("Error in user_deletion:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  download_user_data: async (req, res) => {
    try {
      const user = await User.findById(req.user._id).select("-password -confirmationToken -confirmationTokenExpires -passwordResetToken -passwordResetTokenExpires");
      const workouts = await Workout.find({ user_id: req.user._id });

      res.status(200).json({ user, workouts });
    } catch (error) {
      console.error("Error in download_user_data:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};
