// models/its_product_profiles.js
module.exports = (sequelize, DataTypes) => {
  const its_product_profiles = sequelize.define(
    'its_product_profiles',
    {
      product_profile_id: {
        type: DataTypes.STRING(36),
        primaryKey: true,
      },
      product_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      is_p2p_enable: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      min_amount: {
        type: DataTypes.DECIMAL(18, 2),
        defaultValue: 0,
      },
      max_amount: {
        type: DataTypes.DECIMAL(18, 2),
        defaultValue: 0,
      },
      daily_limit: {
        type: DataTypes.DECIMAL(18, 2),
        defaultValue: 0,
      },
      monthly_limit: {
        type: DataTypes.DECIMAL(18, 2),
        defaultValue: 0,
      },
      commission_percent: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 0,
      },
      service_type_id: {
        type: DataTypes.STRING(36),
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING(100),
        defaultValue: 'active',
      },
    },
    {
      tableName: 'its_product_profiles',
      timestamps: false,
      underscored: true, // optional, if your DB columns are snake_case
    }
  );

  return its_product_profiles;
};
