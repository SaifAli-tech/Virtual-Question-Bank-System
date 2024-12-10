const LoginDTO = require("../dtos/login.dto.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userServices = require("./user.service.js");

const login = async (data) => {
  const { error } = LoginDTO.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
  try {
    const user = await userServices.getUserByEmail(data.email);
    if (!user) {
      throw new Error("No user with this email exists");
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
      throw new Error("Incorrect Password");
    }

    // Sign JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Filter out unnecessary fields
    const { __v, createdAt, updatedAt, password, ...userData } =
      user.toObject();

    return { token, user: userData };
  } catch (error) {
    throw new Error("Error while logging in: " + error.message);
  }
};

const register = async (userData) => {
  return await userServices.register(userData);
};

module.exports = {
  login,
  register,
};
