const bcrypt = require("bcrypt");
const crypto = require("crypto");
const User = require("../models/userModel");
const sendEmail = require("../middleware/sendEmail");

module.exports = {
  forgot_password: async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(200).json({
          success: "Reset link sent to inbox if that email exists",
        });
      }

      const resetToken = crypto.randomBytes(32).toString("hex");
      const hashedToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

      user.passwordResetToken = hashedToken;
      user.passwordResetTokenExpires = Date.now() + 3600000; // 1 hour
      await user.save();

      const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/reset-password/${resetToken}`;
      await sendEmail(
        email,
        "Reset your WorkoutMate password",
        { resetUrl },
        "../templates/requestPasswordReset.handlebars"
      );

      res.status(200).json({
        success: "Reset link sent to inbox if that email exists",
      });
    } catch (error) {
      console.error("Error in forgot_password:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  reset_password: async (req, res) => {
    try {
      const { token } = req.params;
      const { password } = req.body;

      const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

      const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetTokenExpires: { $gt: Date.now() },
      });

      if (!user) {
        return res.status(400).json({ error: "Invalid or expired reset token" });
      }

      const salt = await bcrypt.genSalt(Number(process.env.SALT) || 10);
      user.password = await bcrypt.hash(password, salt);
      user.passwordResetToken = undefined;
      user.passwordResetTokenExpires = undefined;
      await user.save();

      res.status(200).json({
        success: "Password reset successfully",
      });
    } catch (error) {
      console.error("Error in reset_password:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};
