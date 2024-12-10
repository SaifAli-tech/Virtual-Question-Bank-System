const Joi = require("joi");

const descriptiveExamDto = Joi.object({
  user: Joi.string().required().messages({
    "string.base": '"user" should be a type of text',
    "string.empty": '"user" cannot be an empty field',
    "any.required": '"user" is a required field',
  }),
  questions: Joi.array()
    .items(
      Joi.string().required().messages({
        "string.base": '"descriptive question" should be a type of text',
        "any.required": '"descriptive question" is a required field',
      })
    )
    .required()
    .messages({
      "any.required": "Questions array is required.",
    }),
  givenAnswers: Joi.array()
    .items(
      Joi.string().messages({
        "string.base": "Each answer must be a string.",
        "any.required": "Answer is required for each question.",
      })
    )
    .length(Joi.ref("questions.length"))
    .required()
    .messages({
      "array.length":
        "The number of answers must match the number of questions.",
      "any.required": "Answers are required.",
    }),
  timeTaken: Joi.array()
    .items(
      Joi.number().integer().positive().messages({
        "number.base": "Each time taken must be a positive number.",
        "number.positive": "Time taken must be greater than zero.",
      })
    )
    .length(Joi.ref("questions.length"))
    .required()
    .messages({
      "array.length":
        "The number of timeTaken entries must match the number of questions.",
      "any.required": "Time taken is required for each question.",
    }),
  totalScore: Joi.number().required().messages({
    "string.base": '"totalScore" should be a type of number',
    "string.empty": '"totalScore" cannot be an empty field',
    "any.required": '"totalScore" is a required field',
  }),
});

// Function to validate descriptive exam data
const validate = (data) =>
  descriptiveExamDto.validate(data, { abortEarly: false });

// Export the DTO for validation
module.exports = {
  validate,
};
