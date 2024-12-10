const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Enable automatic createdAt and updatedAt fields
  }
);

const Notification = mongoose.model("Notification", NotificationSchema);

module.exports = Notification;
