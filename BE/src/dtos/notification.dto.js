const Joi = require("joi");

// Notification DTO Schema
const notificationDto = Joi.object({
  title: Joi.string().required().messages({
    "string.base": '"notification title" should be a type of text',
    "string.empty": '"notification title" cannot be an empty field',
    "any.required": '"notification title" is a required field',
  }),
  text: Joi.string().required().messages({
    "string.base": '"notification text" should be a type of text',
    "string.empty": '"notification text" cannot be an empty field',
    "any.required": '"notification text" is a required field',
  }),
});

const validate = (data) =>
  notificationDto.validate(data, { abortEarly: false });

// Export the DTO for validation
module.exports = {
  validate,
};
