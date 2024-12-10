const express = require("express");
const router = express.Router();
const DescriptiveExamController = require("../controllers/descriptiveExam.controller");
const authorizeRole = require("../middleware/authRoles");

router.get(
  "/pagedata",
  authorizeRole(["Admin", "Teacher"]),
  DescriptiveExamController.getDescriptiveExamsWithPagination
);
router.get(
  "/",
  authorizeRole(["Admin", "Teacher"]),
  DescriptiveExamController.getAllDescriptiveExams
);
router.get(
  "/:id",
  authorizeRole(["Admin", "Teacher"]),
  DescriptiveExamController.getDescriptiveExamById
);
router.post(
  "/",
  authorizeRole(["Admin", "Teacher", "Student"]),
  DescriptiveExamController.createDescriptiveExam
);
router.put(
  "/:id",
  authorizeRole(["Admin", "Teacher"]),
  DescriptiveExamController.updateDescriptiveExam
);
router.delete(
  "/:id",
  authorizeRole(["Admin"]),
  DescriptiveExamController.deleteDescriptiveExam
);

module.exports = router;
