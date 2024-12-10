const express = require("express");
const router = express.Router();
const RoleController = require("../controllers/role.controller");
const authorizeRole = require("../middleware/authRoles");

router.get(
  "/pagedata",
  authorizeRole(["Admin", "Teacher"]),
  RoleController.getRolesWithPagination
);
router.get(
  "/",
  authorizeRole(["Admin", "Teacher"]),
  RoleController.getAllRoles
);
router.get(
  "/:id",
  authorizeRole(["Admin", "Teacher"]),
  RoleController.getRoleById
);
router.post("/", authorizeRole(["Admin"]), RoleController.createRole);
router.put("/:id", authorizeRole(["Admin"]), RoleController.updateRole);
router.delete("/:id", authorizeRole(["Admin"]), RoleController.deleteRole);

module.exports = router;
