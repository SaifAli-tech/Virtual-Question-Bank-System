const mongoose = require("mongoose");

const DescriptiveExamSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Descriptive",
      },
    ],
    givenAnswers: { type: [String], required: true },
    timeTaken: { type: [Number], required: true },
    totalScore: { type: Number },
    acquiredScores: { type: [Number] },
    status: {
      type: String,
      enum: ["Checked", "Unchecked"],
      default: "Unchecked",
    },
    checkedAt: { type: Date },
  },
  {
    timestamps: true, // Enable automatic createdAt and updatedAt fields
  }
);

const DescriptiveExam = mongoose.model(
  "DescriptiveExam",
  DescriptiveExamSchema
);

module.exports = DescriptiveExam;
