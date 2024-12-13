const { Credential, Profile, Transaction, sequelize } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const { validationResult } = require("express-validator");

const authController = {
  register: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const {
      email,
      username,
      password,
      full_name,
      date_of_birth,
      phone_number,
      address,
    } = req.body;

    try {
      const existingUser = await Credential.findOne({
        where: {
          [Op.or]: [{ email }, { username }],
        },
      });

      if (existingUser) {
        return res
          .status(400)
          .json({ message: "Email or username already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await sequelize.transaction(async (t) => {
        const credential = await Credential.create(
          { email, username, password: hashedPassword },
          { transaction: t }
        );

        await Profile.create(
          {
            credential_id: credential.id,
            full_name,
            date_of_birth,
            phone_number,
            address,
          },
          { transaction: t }
        );
        return credential;
      });

      res
        .status(201)
        .json({ message: "User registered successfully", user: newUser });
    } catch (error) {
      console.error("Error during user registration:", error);
      res.status(500).json({ mesage: "Internal server error" });
    }
  },

  login: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { emailOrUsername, password } = req.body;

    try {
      const user = await Credential.findOne({
        where: {
          [Op.or]: [{ email: emailOrUsername }, { username: emailOrUsername }],
        },
      });

      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid password" });
      }

      const payload = {
        credential_id: user.id,
        email: user.email,
        username: user.username,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 360000000,
      });

      res.status(200).json({ message: "Login successful", token });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  logout: async (req, res) => {
    try {
      res.clearCookie("token");

      res.status(200).json({ message: "Successfully Log Out" });
    } catch (error) {
      console.error("Error during logout:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;

      const user = await Credential.findOne({ where: { email } });
      if (!user) {
        res.status(404).json({ message: "Email not found" });
      }

      const resetToken = crypto.randomBytes(32).toString("hex");
      const resetTokenHash = crypto
        .createHash("sha256")
        .update(resetToken)
        .diges("hex");

      user.reset_password_token = resetTokenHash;
      user.reset_password_expires = Date.now() + 3600000;
      await user.save();

      const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        to: user.email,
        subject: "Password Reset Request",
        text: `You requested a password reset. Click the link below to reset your password:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email.`,
      };

      await transporter.sendMail(mailOptions);

      res
        .status(200)
        .json({ message: "Password reset link sent to your email" });
    } catch (error) {
      console.error("Error during forgot password:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  resetPassword: async (req, res) => {
    try {
      const { token, newPassword } = req.body;

      const resetTokenHash = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");
      const user = await Credential.findOne({
        where: {
          reset_password_token: resetTokenHash,
          reset_token_expire: { [Op.gt]: Date.now() },
        },
      });

      if (!user) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }

      user.password = await bcrypt.hash(newPassword, 10);
      user.reset_password_token = null;
      user.reset_password_expires = null;
      await user.save();

      res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
      console.error("Error resetting password:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  deleteAccount: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await Credential.findOne({
        where: { email },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Validate the password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid password" });
      }

      // Begin transaction for account deletion
      await sequelize.transaction(async (t) => {
        // Delete all related records
        await Profile.destroy({
          where: { credential_id: user.id },
          transaction: t,
        });

        await Transaction.destroy({
          where: { profile_id: user.id }, // Assuming `user_id` is the foreign key in the `Transaction` table
          transaction: t,
        });

        // Add other related models here (e.g., user settings, logs, etc.)
        // await OtherRelatedModel.destroy({
        //   where: { user_id: user.id },
        //   transaction: t,
        // });

        // Finally, delete the user credentials
        await Credential.destroy({
          where: { id: user.id },
          transaction: t,
        });
      });

      res.status(200).json({ message: "Account deleted successfully" });
    } catch (error) {
      console.error("Error during account deletion:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

module.exports = authController;
