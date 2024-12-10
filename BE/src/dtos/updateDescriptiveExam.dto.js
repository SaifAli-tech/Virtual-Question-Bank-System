const Joi = require("joi");

const updateDescriptiveExamDto = Joi.object({
  acquiredScores: Joi.array()
    .items(
      Joi.number().messages({
        "number.base": "Each score must be a number.",
        "number.min": "Scores cannot be negative.",
      })
    )
    .required()
    .messages({
      "any.required": "Scores array is required.",
    }),
  status: Joi.string().valid("Checked", "Unchecked").required().messages({
    "any.only": "Status must be either 'Checked' or 'Unchecked'.",
    "any.required": "Status is required.",
  }),
  checkedAt: Joi.date().iso().required().messages({
    "date.format": "CheckedAt must be a valid ISO date.",
    "any.required": "CheckedAt is required.",
  }),
});

// Function to validate descriptive exam data
const validate = (data) =>
  updateDescriptiveExamDto.validate(data, { abortEarly: false });

// Export the DTO for validation
module.exports = {
  validate,
};
