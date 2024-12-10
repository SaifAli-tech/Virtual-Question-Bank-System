const Joi = require("joi");

// User DTO Schema
const userDto = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    "string.base": '"user name" should be a type of text',
    "string.empty": '"user name" cannot be an empty field',
    "string.min": '"user name" should have a minimum length of {#limit}',
    "string.max": '"user name" should have a maximum length of {#limit}',
    "any.required": '"user name" is a required field',
  }),

  email: Joi.string().email().required().messages({
    "string.base": '"email" should be a type of text',
    "string.empty": '"email" cannot be an empty field',
    "string.email": '"email" must be a valid email',
    "any.required": '"email" is a required field',
  }),

  phone: Joi.string()
    .pattern(/^\d{4}-\d{7}$/)
    .required()
    .messages({
      "string.pattern.base": "Phone must follow the format 0300-1234567",
      "string.base": '"phone" should be a type of text',
      "string.empty": '"phone" cannot be an empty field',
      "any.required": '"phone" is a required field',
    }),

  role: Joi.string().required().messages({
    "string.base": '"role" should be a type of text',
    "string.empty": '"role" cannot be an empty field',
    "any.required": '"role" is a required field',
  }),

  password: Joi.string()
    .min(6) // Adjust the minimum length as needed
    .required()
    .messages({
      "string.base": '"password" should be a type of text',
      "string.empty": '"password" cannot be an empty field',
      "string.min": '"password" should have a minimum length of {#limit}',
      "any.required": '"password" is a required field',
    }),
});

// Function to validate user data
const validate = (data) => userDto.validate(data, { abortEarly: false });

// Export the DTO for validation
module.exports = {
  validate,
};
