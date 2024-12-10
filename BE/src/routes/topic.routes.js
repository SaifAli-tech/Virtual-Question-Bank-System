const express = require("express");
const router = express.Router();
const TopicController = require("../controllers/topic.controller");
const authorizeRole = require("../middleware/authRoles");

router.get(
  "/pagedata",
  authorizeRole(["Admin", "Teacher", "Student"]),
  TopicController.getTopicsWithPagination
);
router.get(
  "/",
  authorizeRole(["Admin", "Teacher", "Student"]),
  TopicController.getAllTopics
);
router.get(
  "/:id",
  authorizeRole(["Admin", "Teacher", "Student"]),
  TopicController.getTopicById
);
router.get(
  "/topicsBySubject/:id",
  authorizeRole(["Admin", "Teacher", "Student"]),
  TopicController.getTopicsBySubject
);
router.post(
  "/",
  authorizeRole(["Admin", "Teacher"]),
  TopicController.createTopic
);
router.put(
  "/:id",
  authorizeRole(["Admin", "Teacher"]),
  TopicController.updateTopic
);
router.delete("/:id", authorizeRole(["Admin"]), TopicController.deleteTopic);

module.exports = router;
