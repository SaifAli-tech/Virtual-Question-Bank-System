const Joi = require("joi");

// MCQ DTO Schema
const mcqDto = Joi.object({
  text: Joi.string().required().messages({
    "string.base": '"mcq" should be a type of text',
    "string.empty": '"mcq" cannot be an empty field',
    "any.required": '"mcq" is a required field',
  }),
  options: Joi.array()
    .items(
      Joi.string().required().messages({
        "string.base": '"options" should be a type of text',
        "string.empty": '"options" cannot be an empty field',
      })
    )
    .min(2)
    .max(4)
    .required()
    .messages({
      "array.base": '"options" should be an array',
      "array.min": "Atleast {#limit} options are required",
      "array.max": "More than {#limit} options are not allowed",
      "any.required": '"options" are required field',
    }),
  answer: Joi.string().required().messages({
    "string.base": '"answer" should be a type of text',
    "string.empty": '"answer" cannot be an empty field',
    "any.required": '"answer" is a required field',
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

// Function to validate mcq data
const validate = (data) => mcqDto.validate(data, { abortEarly: false });

// Export the DTO for validation
module.exports = {
  validate,
};
