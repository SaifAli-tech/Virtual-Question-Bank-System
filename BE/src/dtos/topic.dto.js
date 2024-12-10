const Joi = require("joi");

// Topic DTO Schema
const topicDto = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    "string.base": '"topic name" should be a type of text',
    "string.empty": '"topic name" cannot be an empty field',
    "string.min": '"topic name" should have a minimum length of {#limit}',
    "string.max": '"topic name" should have a maximum length of {#limit}',
    "any.required": '"topic name" is a required field',
  }),

  subject: Joi.string().required().messages({
    "string.base": '"subject" should be a type of text',
    "string.empty": '"subject" cannot be an empty field',
    "any.required": '"subject" is a required field',
  }),
});

const validate = (data) => topicDto.validate(data, { abortEarly: false });

// Export the DTO for validation
module.exports = {
  validate,
};
