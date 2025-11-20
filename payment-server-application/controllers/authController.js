// userController.js
const userService = require("../services/user/userService");
const { response, errorResponse } = require("../core/utils/response");
const { generateToken } = require("../core/utils/token");

/**
 * 🟢 Register User
 */
exports.registerUser = async (req, res, next) => {
  try {
    const payload = req.body;

    const user = await userService.register(payload);

    // Remove sensitive info
    const { password, ...userData } = user;

    return response(res, userData, "User registered successfully");
  } catch (err) {
    next(err);
  }
};

/**
 * 🟢 Login User (email / msisdn / username)
 */
exports.loginUser = async (req, res, next) => {
  try {
    const payload = req.body;

    const user = await userService.login(payload); // should return user object

    // Remove password before returning
    const { password, ...userData } = user;

    // Generate JWT
    const token = generateToken(user.user_id);

    return response(res, { user: userData, token }, "Login successful");
  } catch (err) {
    next(err);
  }
};

/**
 * 🟢 Update User Details
 * Uses JWT-authenticated user_id from req.user
 */
exports.updateUser = async (req, res, next) => {
  try {
    // Use authenticated user_id
    const user_id = req.user.user_id;
    const updateData = req.body;

    const updatedUser = await userService.updateUser(user_id, updateData);

    // Remove sensitive info
    const { password, ...userData } = updatedUser;

    return response(res, userData, "User updated successfully");
  } catch (err) {
    next(err);
  }
};
