const db = require("../config/DB");
const itn_channel_users = db.models.itn_channel_users;
const { Op } = require("sequelize");

class UserRepository {

  //  Find user by ID
  async findById(userId) {
    return await itn_channel_users.findOne({
      where: { user_id: userId },
    });
  }

  //  Find user by phone number
  async findByMsisdn(msisdn) {
    return await itn_channel_users.findOne({
      where: { msisdn },
    });
  }

  //  Find user by email
  async findByEmail(email) {
    return await itn_channel_users.findOne({
      where: { email },
    });
  }

  //  Find user by username (model column: user_name)
  async findByUserName(username) {
    return await itn_channel_users.findOne({
      where: { user_name: username },
    });
  }

  // 🔒 Login (email / msisdn / username)
  async findByEmailOrMsisdnOrUserName(identifier) {
    return await itn_channel_users.findOne({
      where: {
        [Op.or]: [
          { email: identifier },
          { msisdn: identifier },
          { user_name: identifier }
        ],
      },
    });
  }

  // ➕ Create new user
  async createUser(userData) {
    return await itn_channel_users.create(userData);
  }

  // 🔄 Update user
  async updateUser(userId, updateData) {
    return await itn_channel_users.update(updateData, {
      where: { user_id: userId },
    });
  }

  // 📌 Check if user exists by phone
  async userExists(msisdn) {
    const user = await itn_channel_users.findOne({
      where: { msisdn },
    });
    return !!user;
  }

  // 📃 List all active users
  async getActiveUsers() {
    return await itn_channel_users.findAll({
      where: { status: "ACTIVE" },
    });
  }
}

module.exports = new UserRepository();
