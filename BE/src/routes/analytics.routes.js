const express = require("express");
const router = express.Router();
const AnalyticsController = require("../controllers/analytics.controller");
const authorizeRole = require("../middleware/authRoles");

router.get(
  "/",
  authorizeRole(["Admin", "Teacher", "Student"]),
  AnalyticsController.getAnalytics
);

module.exports = router;
