const Role = require("../models/role.model");
const {
  PageOptionsDto,
  PageMetaDto,
  PageDto,
} = require("../common/pagination");
const RoleDTO = require("../dtos/role.dto");

// Get all roles with pagination
const getAllRolesWithPageData = async (pageOptions) => {
  try {
    const pageOptionsDto = new PageOptionsDto(pageOptions);

    // Build the query based on the search
    const query = {};
    if (pageOptionsDto.search) {
      query.name = { $regex: pageOptionsDto.search, $options: "i" };
    }

    // Fetch data with pagination
    const roles = await Role.find(query)
      .skip(pageOptionsDto.skip)
      .limit(pageOptionsDto.take)
      .sort({
        [pageOptionsDto.orderBy || "name"]: pageOptionsDto.order,
      });

    // Get total count of matching documents
    const itemCount = await Role.countDocuments(query);

    // Create pagination metadata
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    // Return paginated data with metadata
    return new PageDto(roles, pageMetaDto);
  } catch (error) {
    throw new Error("Error while fetching roles: " + error.message);
  }
};

// Get all roles
const getAllRoles = async () => {
  try {
    return await Role.find();
  } catch (error) {
    throw new Error("Error while fetching roles: " + error.message);
  }
};

// Get role by ID
const getRoleById = async (roleId) => {
  try {
    const role = await Role.findById(roleId);
    if (!role) {
      throw new Error("Role not found");
    }
    return role;
  } catch (error) {
    throw new Error("Error while fetching role: " + error.message);
  }
};

const getRoleByName = async (roleName) => {
  const role = await Role.findOne({
    name: { $regex: `^${roleName.trim()}$`, $options: "i" },
  });
  return role._id;
};

// Create a new role
const createRole = async (roleData) => {
  const { error } = RoleDTO.validate(roleData);
  if (error) {
    throw new Error(error.details[0].message);
  }
  try {
    const existingRole = await Role.findOne({
      name: { $regex: `^${roleData.name.trim()}$`, $options: "i" },
    });
    if (existingRole) throw new Error("Role with this name already exists");
    const role = new Role(roleData);
    return await role.save();
  } catch (error) {
    throw new Error("Error while creating role: " + error.message);
  }
};

// Update role by ID
const updateRole = async (roleId, roleData) => {
  const { error } = RoleDTO.validate(roleData);
  if (error) {
    throw new Error(error.details[0].message);
  }
  try {
    const existingRole = await Role.findOne({
      name: { $regex: `^${roleData.name.trim()}$`, $options: "i" },
      _id: { $ne: roleId },
    });
    if (existingRole) throw new Error("Role with this name already exists");
    const updatedrole = await Role.findByIdAndUpdate(roleId, roleData, {
      new: true,
    });
    if (!updatedrole) {
      throw new Error("Role not found");
    }
    return updatedrole;
  } catch (error) {
    throw new Error("Error while updating role: " + error.message);
  }
};

// Delete role by ID
const deleteRole = async (roleId) => {
  try {
    const UserServices = require("./user.service.js");
    const user = await UserServices.getUserByRole(roleId);
    if (!user) {
      const deletedrole = await Role.findByIdAndDelete(roleId);
      if (!deletedrole) {
        throw new Error("Role not found");
      }
      return deletedrole;
    } else if (user) {
      throw new Error("This role is in use so it can't be deleted");
    }
  } catch (error) {
    throw new Error("Error while deleting role: " + error.message);
  }
};

module.exports = {
  getAllRolesWithPageData,
  getAllRoles,
  getRoleById,
  getRoleByName,
  createRole,
  updateRole,
  deleteRole,
};
