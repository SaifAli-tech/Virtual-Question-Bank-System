const express = require("express");
const router = express.Router();
const McqExamController = require("../controllers/mcqExam.controller");
const authorizeRole = require("../middleware/authRoles");

router.get(
  "/pagedata",
  authorizeRole(["Admin", "Teacher"]),
  McqExamController.getMcqExamsWithPagination
);
router.get(
  "/",
  authorizeRole(["Admin", "Teacher"]),
  McqExamController.getAllMcqExams
);
router.get(
  "/:id",
  authorizeRole(["Admin", "Teacher"]),
  McqExamController.getMcqExamById
);
router.post(
  "/",
  authorizeRole(["Admin", "Teacher", "Student"]),
  McqExamController.createMcqExam
);
router.put(
  "/:id",
  authorizeRole(["Admin", "Teacher"]),
  McqExamController.updateMcqExam
);
router.delete(
  "/:id",
  authorizeRole(["Admin"]),
  McqExamController.deleteMcqExam
);

module.exports = router;
