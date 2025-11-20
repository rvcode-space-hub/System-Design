module.exports = (sequelize, DataTypes) => {
  const itn_wallets = sequelize.define(
    "itn_wallets",
    {
      wallet_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      msisdn: {
        type: DataTypes.STRING,
        allowNull: false
      },
      user_type: {
        type: DataTypes.STRING,
        allowNull: false
      },
      wallet_type: {
        type: DataTypes.STRING,
        defaultValue: 'PRIMARY'
      },
      balance: {
        type: DataTypes.DECIMAL(20, 2),
        defaultValue: 0
      },
      locked_balance: {
        type: DataTypes.DECIMAL(20, 2),
        defaultValue: 0
      },
      prev_balance: {
        type: DataTypes.DECIMAL(20, 2),
        defaultValue: 0
      }
    },
    {
      tableName: 'itn_wallets',
      timestamps: true
    }
  );

  return itn_wallets;
};
