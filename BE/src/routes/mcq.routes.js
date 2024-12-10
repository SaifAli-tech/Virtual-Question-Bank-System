const express = require("express");
const router = express.Router();
const McqController = require("../controllers/mcq.controller");
const authorizeRole = require("../middleware/authRoles");

router.get(
  "/pagedata",
  authorizeRole(["Admin", "Teacher", "Student"]),
  McqController.getMcqsWithPagination
);
router.get(
  "/",
  authorizeRole(["Admin", "Teacher", "Student"]),
  McqController.getAllMcqs
);
router.get(
  "/getQuestions",
  authorizeRole(["Admin", "Teacher", "Student"]),
  McqController.getPreparationQuestions
);
router.get(
  "/:id",
  authorizeRole(["Admin", "Teacher", "Student"]),
  McqController.getMcqById
);
router.post("/", authorizeRole(["Admin", "Teacher"]), McqController.createMcq);
router.put(
  "/:id",
  authorizeRole(["Admin", "Teacher"]),
  McqController.updateMcq
);
router.delete("/:id", authorizeRole(["Admin"]), McqController.deleteMcq);

module.exports = router;
