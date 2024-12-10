const Joi = require("joi");

const loginDto = Joi.object({
  email: Joi.string().email().required().messages({
    "string.base": '"email" should be a type of text',
    "string.empty": '"email" cannot be an empty field',
    "string.email": '"email" must be a valid email',
    "any.required": '"email" is a required field',
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

// Function to validate login data
const validate = (data) => loginDto.validate(data, { abortEarly: false });

// Export the DTO for validation
module.exports = {
  validate,
};
