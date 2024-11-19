const {body} = require('express-validator')
const registerValidation = [
    body("email")
      .isEmail()
      .withMessage("Please provide a valid email address")
      .normalizeEmail(),
    body("username")
      .isLength({ min: 3 })
      .withMessage("Username must be at least 3 characters long"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long")
      .matches(/\d/)
      .withMessage("Password must contain at least one number")
      .matches(/[A-Z]/)
      .withMessage("Password must contain at least one uppercase letter"),
    body("full_name").optional().isString().trim().escape(),
    body("date_of_birth")
      .optional()
      .isISO8601()
      .withMessage("Date of birth must be a valid date in ISO8601 format"),
    body("phone_number")
      .optional()
      .isMobilePhone()
      .withMessage("Please provide a valid phone number"),
    body("address").optional().isString().trim().escape(),
  ];

  module.exports = {
    registerValidation,
  };