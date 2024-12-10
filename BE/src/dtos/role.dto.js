const Joi = require("joi");

// Role DTO Schema
const roleDto = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    "string.base": '"role name" should be a type of text',
    "string.empty": '"role name" cannot be an empty field',
    "string.min": '"role name" should have a minimum length of {#limit}',
    "string.max": '"role name" should have a maximum length of {#limit}',
    "any.required": '"role name" is a required field',
  }),
});

const validate = (data) => roleDto.validate(data, { abortEarly: false });

// Export the DTO for validation
module.exports = {
  validate,
};
