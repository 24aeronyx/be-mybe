const { body } = require('express-validator');

const updateProfileValidation = [
  body('full_name').optional().isString().withMessage('Full name must be a string'),
  body('date_of_birth').optional().isISO8601().withMessage('Invalid date format'),
  body('phone_number').optional().isMobilePhone().withMessage('Invalid phone number'),
  body('address').optional().isString().withMessage('Address must be a string'),
  body('profile_picture').optional().isURL().withMessage('Profile picture must be a valid URL')
];

module.exports = updateProfileValidation;
