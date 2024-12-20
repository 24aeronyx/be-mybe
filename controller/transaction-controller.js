const { Transaction, Profile } = require("../models");
const { Op } = require("sequelize");
const moment = require("moment-timezone");

const transactionController = {
  addIncome: async (req, res) => {
    try {
      const { credential_id } = req.user;
      const { amount, description, title, category, date } = req.body;

      // Validate the date format (YYYY-MM-DD)
      const isValidDate = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(date);
      if (!isValidDate) {
        return res.status(400).json({
          message:
            "Invalid date format. Please provide a valid date in YYYY-MM-DD format.",
        });
      }

      // Validate category (only income categories are valid)
      const validCategories = [
        "Salary",
        "Investment",
        "Gift",
        "Freelance", // Kategori income
      ];

      if (!validCategories.includes(category)) {
        return res.status(400).json({
          message: `Invalid category. Please choose from the following: ${validCategories.join(
            ", "
          )}`,
        });
      }

      const profile = await Profile.findOne({ where: { credential_id } });

      if (!profile) {
        return res.status(404).json({
          message: "Profile not found",
        });
      }

      // The date comes from the frontend already in the correct format (YYYY-MM-DD)
      // No need for any conversion; we can directly use it to create the transaction.
      const transactionDate = new Date(date); // This will be in UTC by default

      await Transaction.create({
        profile_id: profile.id,
        type: "income",
        amount,
        description,
        title,
        category,
        transaction_date: transactionDate, // Store the date as inputted (no conversion)
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
      const { amount, description, title, category, date } = req.body;

      // Validate the date format (YYYY-MM-DD)
      const isValidDate = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(date);
      if (!isValidDate) {
        return res.status(400).json({
          message:
            "Invalid date format. Please provide a valid date in YYYY-MM-DD format.",
        });
      }

      const profile = await Profile.findOne({ where: { credential_id } });

      if (!profile) {
        return res.status(404).json({
          message: "Profile not found",
        });
      }

      const transactionDate = new Date(date); 

      await Transaction.create({
        profile_id: profile.id,
        type: "outcome",
        amount,
        description,
        title,
        category,
        transaction_date: transactionDate, // Store the date as inputted (no conversion)
      });

      profile.balance = profile.balance - amount;
      await profile.save();

      res.status(201).json({ message: "Outcome added" });
    } catch (error) {
      console.error("Failed to add outcome", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  getMonthlyReport: async (req, res) => {
    try {
      const { credential_id } = req.user;
      const { year, month } = req.query;

      if (!year || !month) {
        return res.status(400).json({ message: "Year and month are required" });
      }

      const profile = await Profile.findOne({ where: { credential_id } });

      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }

      const transactions = await Transaction.findAll({
        where: {
          profile_id: profile.id,
          transaction_date: {
            [Op.gte]: new Date(year, month - 1, 1),
            [Op.lt]: new Date(year, month, 1),
          },
        },
        order: [["transaction_date", "ASC"]],
      });

      res.status(200).json({
        year,
        month,
        transactions,
        balance: profile.balance,
      });
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  getHistory: async (req, res) => {
    try {
      const { credential_id } = req.user;

      const profile = await Profile.findOne({
        where: { credential_id },
        attributes: ["id"],
      });

      if (!profile) {
        return res.status(400).json({ message: "Profile not found" });
      }

      const transactions = await Transaction.findAll({
        where: { profile_id: profile.id },
        attributes: [
          "id",
          "type",
          "amount",
          "transaction_date",
          "description",
          "title",
          "category",
        ],
        order: [["transaction_date", "DESC"]],
      });

      if (transactions.length === 0) {
        return res
          .status(404)
          .json({ message: "No transaction history found" });
      }

      res.status(200).json({
        transactions,
      });
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

module.exports = transactionController;
