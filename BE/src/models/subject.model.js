const mongoose = require("mongoose");

const SubjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true, // Enable automatic createdAt and updatedAt fields
  }
);

const Subject = mongoose.model("Subject", SubjectSchema);

module.exports = Subject;
