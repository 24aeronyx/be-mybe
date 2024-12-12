const { Transaction, Profile } = require("../models");
const { Op } = require("sequelize");
const moment = require('moment-timezone');

const transactionController = {
  addIncome: async (req, res) => {
    try {
      const { credential_id } = req.user;
      const { amount, description, title, category } = req.body;

      const profile = await Profile.findOne({ where: { credential_id } });

      if (!profile) {
        return res.status(404).json({
          message: "Profile not found",
        });
      }

      const kalimantanTimurTime = moment.tz("Asia/Makassar").format();

      await Transaction.create({
        profile_id: profile.id,
        type: "income",
        amount,
        description,
        title,
        category,
        transaction_date:  kalimantanTimurTime,
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
      const { amount, description, title, category } = req.body;

      const profile = await Profile.findOne({ where: { credential_id } });

      if (!profile) {
        return res.status(404).json({
          message: "Profile not found",
        });
      }

      const kalimantanTimurTime = moment.tz("Asia/Makassar").format();
      console.log(kalimantanTimurTime)

      await Transaction.create({
        profile_id: profile.id,
        type: "outcome",
        amount,
        description,
        title,
        category,
        transaction_date: kalimantanTimurTime,
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
