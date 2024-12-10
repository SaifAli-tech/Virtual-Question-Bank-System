const User = require("../models/user.model");
const {
  PageOptionsDto,
  PageMetaDto,
  PageDto,
} = require("../common/pagination");
const UserDTO = require("../dtos/user.dto.js");
const UserUpdateDTO = require("../dtos/userUpdate.dto.js");
const RegisterDTO = require("../dtos/register.dto.js");
const ChangePasswordDTO = require("../dtos/changePassword.dto.js");
const UpdateProfileDTO = require("../dtos/updateProfile.dto.js");
const roleServices = require("./role.service.js");
const DescriptiveExamServices = require("./descriptiveExam.service.js");
const McqExamServices = require("./mcqExam.service.js");
const bcrypt = require("bcryptjs");

// Get all users with pagination
const getAllUsersWithPageData = async (pageOptions) => {
  try {
    const pageOptionsDto = new PageOptionsDto(pageOptions);

    // Build the query based on the search
    const query = {};
    if (pageOptionsDto.search) {
      query.name = { $regex: pageOptionsDto.search, $options: "i" };
    }

    if (pageOptionsDto.filter) {
      query.role = pageOptionsDto.filter;
    }

    // Fetch data with pagination
    const users = await User.find(query)
      .skip(pageOptionsDto.skip)
      .limit(pageOptionsDto.take)
      .sort({
        [pageOptionsDto.orderBy || "name"]: pageOptionsDto.order,
      })
      .populate("role");

    // Get total count of matching documents
    const itemCount = await User.countDocuments(query);

    // Create pagination metadata
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    // Return paginated data with metadata
    return new PageDto(users, pageMetaDto);
  } catch (error) {
    throw new Error("Error while fetching users: " + error.message);
  }
};

// Get all users
const getAllUsers = async () => {
  try {
    return await User.find();
  } catch (error) {
    throw new Error("Error while fetching users: " + error.message);
  }
};

// Get user by ID
const getUserById = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    throw new Error("Error while fetching user: " + error.message);
  }
};

const getUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ email }).populate("role", "_id name");
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    throw new Error(`Error while fetching user: ${error.message}`);
  }
};

const getUserByRole = async (role) => {
  try {
    const user = await User.findOne({ role });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    throw new Error(`Error while fetching user: ${error.message}`);
  }
};

const getUserByCode = async (code) => {
  try {
    const user = await User.findOne({ code });
    if (!user) {
      throw new Error("User not found");
    }
    return user._id;
  } catch (error) {
    throw new Error(`Error while fetching user: ${error.message}`);
  }
};

// Create a new user
const createUser = async (userData) => {
  const { error } = UserDTO.validate(userData);
  if (error) {
    throw new Error(error.details[0].message);
  }
  try {
    const existingEmail = await User.findOne({ email: userData.email });
    if (existingEmail) throw new Error("User with this email already exists");
    const existingPhone = await User.findOne({ phone: userData.phone });
    if (existingPhone)
      throw new Error("User with this phone number already exists");
    let code;

    const isStudent =
      (await roleServices.getRoleByName("Student")) == userData.role
        ? true
        : false;
    const prefix = isStudent ? "STU" : "EMP";
    const length = isStudent ? 5 : 4;

    const lastUser = await User.findOne({ code: new RegExp(`^${prefix}`) })
      .sort({ code: -1 })
      .limit(1);

    const lastNumber = lastUser
      ? parseInt(lastUser.code.replace(prefix, ""))
      : 0;
    code = `${prefix}${String(lastNumber + 1).padStart(length, "0")}`;

    userData.code = code;
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    userData.password = hashedPassword;
    const user = new User(userData);
    return await user.save();
  } catch (error) {
    throw new Error("Error while creating user: " + error.message);
  }
};

const register = async (userData) => {
  const { error } = RegisterDTO.validate(userData);
  if (error) {
    throw new Error(error.details[0].message);
  }
  try {
    const existingEmail = await User.findOne({ email: userData.email });
    if (existingEmail) throw new Error("User with this email already exists");
    const existingPhone = await User.findOne({ phone: userData.phone });
    if (existingPhone)
      throw new Error("User with this phone number already exists");

    userData.role = await roleServices.getRoleByName("Student");
    let code;
    const prefix = "STU";
    const length = 5;

    const lastUser = await User.findOne({ code: new RegExp(`^${prefix}`) })
      .sort({ code: -1 })
      .limit(1);

    const lastNumber = lastUser
      ? parseInt(lastUser.code.replace(prefix, ""))
      : 0;
    code = `${prefix}${String(lastNumber + 1).padStart(length, "0")}`;

    userData.code = code;
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    userData.password = hashedPassword;
    const user = new User(userData);
    return await user.save();
  } catch (error) {
    throw new Error("Error while creating user: " + error.message);
  }
};

// Update user by ID
const updateUser = async (userId, userData) => {
  const { error } = UserUpdateDTO.validate(userData);
  if (error) {
    throw new Error(error.details[0].message);
  }

  try {
    const existingEmail = await User.findOne({
      email: userData.email,
      _id: { $ne: userId },
    });
    if (existingEmail) throw new Error("User with this email already exists");
    const existingPhone = await User.findOne({
      phone: userData.phone,
      _id: { $ne: userId },
    });
    if (existingPhone)
      throw new Error("User with this phone number already exists");

    const updatedUser = await User.findByIdAndUpdate(userId, userData, {
      new: true,
    });

    if (!updatedUser) {
      throw new Error("User not found");
    }

    return updatedUser;
  } catch (error) {
    throw new Error("Error while updating user: " + error.message);
  }
};

// Delete user by ID
const deleteUser = async (userId) => {
  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      throw new Error("User not found");
    }
    await DescriptiveExamServices.deleteDescriptiveExamsByUserId(userId);
    await McqExamServices.deleteMcqExamsByUserId(userId);
    return deletedUser;
  } catch (error) {
    throw new Error("Error while deleting user: " + error.message);
  }
};

const changePassword = async (userId, data) => {
  const { error } = ChangePasswordDTO.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      {
        new: true,
      }
    );

    return updatedUser;
  } catch (error) {
    throw new Error("Error while changing password: " + error.message);
  }
};

const updateProfile = async (userId, userData) => {
  const { error } = UpdateProfileDTO.validate(userData);
  if (error) {
    throw new Error(error.details[0].message);
  }

  try {
    const existingEmail = await User.findOne({
      email: userData.email,
      _id: { $ne: userId },
    });
    if (existingEmail) throw new Error("User with this email already exists");
    const existingPhone = await User.findOne({
      phone: userData.phone,
      _id: { $ne: userId },
    });
    if (existingPhone)
      throw new Error("User with this phone number already exists");

    const updatedUser = await User.findByIdAndUpdate(userId, userData, {
      new: true,
    });

    if (!updatedUser) {
      throw new Error("User not found");
    }

    return updatedUser;
  } catch (error) {
    throw new Error("Error while updating profile: " + error.message);
  }
};

module.exports = {
  getAllUsersWithPageData,
  getAllUsers,
  getUserById,
  getUserByEmail,
  getUserByRole,
  getUserByCode,
  createUser,
  register,
  updateUser,
  deleteUser,
  changePassword,
  updateProfile,
};
