module.exports = (sequelize, DataTypes) => {
  const itn_transactions = sequelize.define(
    "itn_transactions",
    {
      transaction_id: {
        type: DataTypes.STRING(36),
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      sender_wallet_id: {
        type: DataTypes.STRING(36),
        allowNull: false,
      },
      receiver_wallet_id: {
        type: DataTypes.STRING(36),
        allowNull: false,
      },
      user_id: {
        type: DataTypes.STRING(36),
        allowNull: true,
      },
      meta: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      amount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
      },
      commission: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: true,
        defaultValue: 0,
      },
      type: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: "P2P",
      },
      status: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: "PROCESSING",
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "itn_transactions", // keep old table name
      timestamps: false,             // we handle created_at & updated_at manually
      underscored: true,
    }
  );

  return itn_transactions;
};
