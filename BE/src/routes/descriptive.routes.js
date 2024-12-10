const express = require("express");
const router = express.Router();
const DescriptiveController = require("../controllers/descriptive.controller");
const authorizeRole = require("../middleware/authRoles");

router.get(
  "/pagedata",
  authorizeRole(["Admin", "Teacher", "Student"]),
  DescriptiveController.getDescriptiveQuestionsWithPagination
);
router.get(
  "/",
  authorizeRole(["Admin", "Teacher", "Student"]),
  DescriptiveController.getAllDescriptiveQuestions
);
router.get(
  "/getQuestions",
  authorizeRole(["Admin", "Teacher", "Student"]),
  DescriptiveController.getPreparationQuestions
);
router.get(
  "/:id",
  authorizeRole(["Admin", "Teacher", "Student"]),
  DescriptiveController.getDescriptiveQuestionById
);
router.post(
  "/",
  authorizeRole(["Admin", "Teacher"]),
  DescriptiveController.createDescriptiveQuestion
);
router.put(
  "/:id",
  authorizeRole(["Admin", "Teacher"]),
  DescriptiveController.updateDescriptiveQuestion
);
router.delete(
  "/:id",
  authorizeRole(["Admin"]),
  DescriptiveController.deleteDescriptiveQuestion
);

module.exports = router;
