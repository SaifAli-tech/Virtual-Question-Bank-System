const express = require("express");
const router = express.Router();
const SubjectController = require("../controllers/subject.controller");
const authorizeRole = require("../middleware/authRoles");

router.get(
  "/pagedata",
  authorizeRole(["Admin", "Teacher", "Student"]),
  SubjectController.getSubjectsWithPagination
);
router.get(
  "/",
  authorizeRole(["Admin", "Teacher", "Student"]),
  SubjectController.getAllSubjects
);
router.get(
  "/:id",
  authorizeRole(["Admin", "Teacher", "Student"]),
  SubjectController.getSubjectById
);
router.post(
  "/",
  authorizeRole(["Admin", "Teacher"]),
  SubjectController.createSubject
);
router.put(
  "/:id",
  authorizeRole(["Admin", "Teacher"]),
  SubjectController.updateSubject
);
router.delete(
  "/:id",
  authorizeRole(["Admin"]),
  SubjectController.deleteSubject
);

module.exports = router;
