const Joi = require("joi");

// Descriptive Question DTO Schema
const descriptiveDto = Joi.object({
  text: Joi.string().required().messages({
    "string.base": '"descriptive question" should be a type of text',
    "string.empty": '"descriptive question" cannot be an empty field',
    "any.required": '"descriptive question" is a required field',
  }),
  answer: Joi.string().required().messages({
    "string.base": '"answer" should be a type of text',
    "string.empty": '"answer" cannot be an empty field',
    "any.required": '"answer" is a required field',
  }),
  hint: Joi.string().allow(null, "").messages({
    "string.base": '"hint" should be a type of text or null',
  }),
  topic: Joi.string().required().messages({
    "string.base": '"topic" should be a type of text',
    "string.empty": '"topic" cannot be an empty field',
    "any.required": '"topic" is a required field',
  }),
  difficulty: Joi.string().required().messages({
    "string.base": '"difficulty" should be a type of text',
    "string.empty": '"difficulty" cannot be an empty field',
    "any.required": '"difficulty" is a required field',
  }),
});

// Function to validate descriptive question data
const validate = (data) => descriptiveDto.validate(data, { abortEarly: false });

// Export the DTO for validation
module.exports = {
  validate,
};
