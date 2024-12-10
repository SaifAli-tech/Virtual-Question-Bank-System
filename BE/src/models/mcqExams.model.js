const mongoose = require("mongoose");

const McqExamSchema = new mongoose.Schema(
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
        ref: "Mcq",
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

const McqExam = mongoose.model("McqExam", McqExamSchema);

module.exports = McqExam;
