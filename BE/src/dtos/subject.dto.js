const Joi = require("joi");

// Subject DTO Schema
const subjectDto = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    "string.base": '"subject name" should be a type of text',
    "string.empty": '"subject name" cannot be an empty field',
    "string.min": '"subject name" should have a minimum length of {#limit}',
    "string.max": '"subject name" should have a maximum length of {#limit}',
    "any.required": '"subject name" is a required field',
  }),
});

const validate = (data) => subjectDto.validate(data, { abortEarly: false });

// Export the DTO for validation
module.exports = {
  validate,
};
