const { Profile } = require("../models");

const profileController = {
  getBalance: async (req, res) => {
    try {
      const { credential_id } = req.user;

      const profile = await Profile.findOne({
        where: { credential_id },
        attributes: ["balance"],
      });

      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }

      res.status(200).json({
        balance: profile.balance,
      });
    } catch (error) {
      console.error("Error fetching balance:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  getProfile: async (req, res) => {
    try {
      const { credential_id } = req.user;

      const profile = await Profile.findOne({
        where: { credential_id },
      });

      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }

      res.status(200).json({
        message: "Profile fetched successfully",
        profile,
      });
    } catch (error) {
      console.error("Error fetching profile", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  updateProfile: async (req, res) => {
    try {
      const { credential_id } = req.user;
      const { full_name, date_of_birth, phone_number, address } = req.body;

      const profile = await Profile.findOne({
        where: { credential_id },
      });

      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }

      await profile.update({
        full_name,
        date_of_birth,
        phone_number,
        address,
      });

      res.status(200).json({
        message: "Profile updated successfully",
        profile,
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

module.exports = profileController;
