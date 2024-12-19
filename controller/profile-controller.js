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

      // Cek apakah user terautentikasi
      if (!credential_id) {
        return res.status(401).json({
          message: "Unauthorized access",
          error_type: "UNAUTHORIZED",
        });
      }

      const profile = await Profile.findOne({
        where: { credential_id },
      });

      // Cek apakah profil ditemukan
      if (!profile) {
        return res.status(404).json({
          message: "Profile not found",
          error_type: "NOT_FOUND",
        });
      }

      // Cek apakah data tidak berubah
      if (
        full_name === profile.full_name &&
        date_of_birth === profile.date_of_birth &&
        phone_number === profile.phone_number &&
        address === profile.address
      ) {
        return res.status(304).json({
          message: "No changes detected",
          error_type: "NOT_MODIFIED",
        });
      }

      // Update profil
      await profile.update({
        full_name,
        date_of_birth,
        phone_number,
        address,
      });

      return res.status(200).json({
        message: "Profile updated successfully",
        profile,
      });
    } catch (error) {
      console.error("Error updating profile:", error);

      // Penanganan tipe kesalahan
      if (error.name === "SequelizeValidationError") {
        return res.status(400).json({
          message: "Validation error",
          error_type: "VALIDATION_ERROR",
          details: error.errors.map((e) => e.message), // Detail validasi
        });
      }

      if (error.name === "SequelizeDatabaseError") {
        return res.status(500).json({
          message: "Database error",
          error_type: "DATABASE_ERROR",
          details: error.message,
        });
      }

      if (error.name === "SequelizeUniqueConstraintError") {
        return res.status(409).json({
          message: "Unique constraint error",
          error_type: "CONSTRAINT_ERROR",
          details: error.errors.map((e) => e.message),
        });
      }

      // Default untuk kesalahan lain
      return res.status(500).json({
        message: "Internal server error",
        error_type: "INTERNAL_ERROR",
        details: error.message,
      });
    }
  },
};

module.exports = profileController;
