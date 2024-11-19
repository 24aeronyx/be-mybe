const { Transaction, Profile } = require("../models");

const transactionController = {
  addIncome: async (req, res) => {
    try {
      const { credential_id } = req.user;
      const { amount, description } = req.body;

      const profile = await Profile.findOne({ where: { credential_id } });

      if (!profile) {
        return res.status(404).json({
          message: "Profile not found",
        });
      }

      await Transaction.create({
        profile_id: profile.id,
        type: "income",
        amount,
        description,
        transaction_date: new Date(),
      });

      profile.balance = profile.balance + amount;
      await profile.save();

      res.status(201).json({ message: "Income added" });
    } catch (error) {
      console.error("Failed to add income", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  addOutcome: async (req, res) => {
    try {
      const { credential_id } = req.user;
      const { amount, description } = req.body;

      const profile = await Profile.findOne({ where: { credential_id } });

      if (!profile) {
        return res.status(404).json({
          message: "Profile not found",
        });
      }

      await Transaction.create({
        profile_id: profile.id,
        type: "outcome",
        amount,
        description,
        transaction_date: new Date(),
      });

      profile.balance = profile.balance - amount;
      await profile.save();

      res.status(201).json({ message: "Outcome added" });
    } catch (error) {
      console.error("Failed to add outcome", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

module.exports = transactionController;
