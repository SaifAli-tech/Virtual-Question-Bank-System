const mongoose = require("mongoose");

const DescriptiveSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      unique: true,
    },
    answer: {
      type: String,
      required: true,
    },
    hint: {
      type: String,
      default: "No hint",
    },
    topic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Topic",
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },
  },
  {
    timestamps: true, // Enable automatic createdAt and updatedAt fields
  }
);

const Descriptive = mongoose.model("Descriptive", DescriptiveSchema);

module.exports = Descriptive;
