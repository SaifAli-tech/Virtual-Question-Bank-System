const express = require("express");
const router = express.Router();
const NotificationController = require("../controllers/notification.controller");
const authorizeRole = require("../middleware/authRoles");

router.get(
  "/pagedata",
  authorizeRole(["Admin", "Teacher", "Student"]),
  NotificationController.getNotificationsWithPagination
);
router.get(
  "/",
  authorizeRole(["Admin", "Teacher", "Student"]),
  NotificationController.getAllNotifications
);
router.get(
  "/:id",
  authorizeRole(["Admin", "Teacher", "Student"]),
  NotificationController.getNotificationById
);
router.post(
  "/",
  authorizeRole(["Admin"]),
  NotificationController.createNotification
);
router.put(
  "/:id",
  authorizeRole(["Admin"]),
  NotificationController.updateNotification
);
router.delete(
  "/:id",
  authorizeRole(["Admin"]),
  NotificationController.deleteNotification
);

module.exports = router;
