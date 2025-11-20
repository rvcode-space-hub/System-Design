const bcrypt = require("bcryptjs");
const userRepository = require("../../repositories/userRepository");
const ApiError = require("../../core/errors/ApiError");
const { generateToken } = require("../../core/utils/token");
const { v4: uuidv4 } = require("uuid");

class UserService {

  //  Register User
  async register({ user_name, password }) {

    if (!user_name || !password) {
      throw new ApiError(400, "Username and password are required");
    }

    // Check if username exists
    const existingUser = await userRepository.findByUserName(user_name);
    if (existingUser) {
      throw new ApiError(400, "Username already taken");
    }

    // Generate USER ID
    const user_id = uuidv4();

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User
    const newUser = await userRepository.createUser({
      user_id,
      user_name,
      password: hashedPassword,
      kyc_status: "PENDING",
      status: "ACTIVE"
    });

    return {
      user_id: newUser.user_id,
      user_name: newUser.user_name,
      kyc_status: newUser.kyc_status,
    };
  }

  //  Login User
  async login({ identifier, password }) {

    if (!identifier || !password) {
      throw new ApiError(400, "Identifier and password are required");
    }

    // Find by email OR msisdn OR username
    const user = await userRepository.findByEmailOrMsisdnOrUserName(identifier);

    if (!user) {
      throw new ApiError(404, "Invalid login credentials");
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new ApiError(401, "Invalid password");
    }

    // Generate token
    const token = generateToken(user.user_id);

    return {
      token,
      user: {
        user_id: user.user_id,
        user_name: user.user_name,
        email: user.email,
        msisdn: user.msisdn,
        kyc_status: user.kyc_status,
      }
    };
  }

  //  Update User
  async updateUser(userId, updateData) {

    const existing = await userRepository.findById(userId);
    if (!existing) {
      throw new ApiError(404, "User not found");
    }

    await userRepository.updateUser(userId, updateData);

    return await userRepository.findById(userId);
  }
}

module.exports = new UserService();
