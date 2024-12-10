const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user.controller");
const authorizeRole = require("../middleware/authRoles");

router.get(
  "/pagedata",
  authorizeRole(["Admin", "Teacher"]),
  UserController.getUsersWithPagination
);
router.get(
  "/",
  authorizeRole(["Admin", "Teacher"]),
  UserController.getAllUsers
);
router.get(
  "/:id",
  authorizeRole(["Admin", "Teacher", "Student"]),
  UserController.getUserById
);
router.post("/", authorizeRole(["Admin"]), UserController.createUser);
router.put(
  "/:id",
  authorizeRole(["Admin", "Student"]),
  UserController.updateUser
);
router.put(
  "/changePassword/:id",
  authorizeRole(["Admin", "Teacher", "Student"]),
  UserController.changePassword
);
router.put(
  "/updateProfile/:id",
  authorizeRole(["Admin", "Teacher", "Student"]),
  UserController.updateProfile
);
router.delete("/:id", authorizeRole(["Admin"]), UserController.deleteUser);

module.exports = router;
