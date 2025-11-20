module.exports = (sequelize, DataTypes) => {
  const itn_channel_users = sequelize.define(
    "itn_channel_users",
    {
      user_id: {
        type: DataTypes.STRING(50),
        primaryKey: true,
      },
      

      // 👤 Username (used for login / lookup)
      user_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true, // Recommended for username
      },

      // 🔒 Password (hashed)
      password: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },

      // 📱 Mobile Number
      msisdn: {
        type: DataTypes.STRING(15),
        allowNull: true,
        unique: true,
      },

      // 📧 Email (Optional — add if you need)
      email: {
        type: DataTypes.STRING(100),
        allowNull: true,
        unique: true,
      },

      // 🪪 KYC Status
      kyc_status: {
        type: DataTypes.ENUM("PENDING", "VERIFIED", "REJECTED"),
        defaultValue: "PENDING",
      },

      // 🟢 User Status
      status: {
        type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
        defaultValue: "ACTIVE",
      },
    },
    {
      tableName: "itn_channel_users",
      timestamps: false,
    }
  );

  return itn_channel_users;
};
