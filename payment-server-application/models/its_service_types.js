// models/its_service_types.js
module.exports = (sequelize, DataTypes) => {
  const its_service_types = sequelize.define(
    "its_service_types",
    {
      service_type_id: {
        type: DataTypes.STRING(36),
        primaryKey: true,
      },

      // ───────────────────────────────────────────
      // BASIC SERVICE INFO
      // ───────────────────────────────────────────
      service_code: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      service_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      // NEW: CHANNEL (Wallet, UPI, AEPS, etc.)
      channel: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "WALLET",
      },

      // ───────────────────────────────────────────
      // COMMISSION SETTINGS
      // ───────────────────────────────────────────
      commission_type: {
        type: DataTypes.STRING, // PERCENTAGE / FIXED / SLAB
        allowNull: false,
      },

      commission_rate: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
      },

      min_commission: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
      },

      max_commission: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
      },

      // ───────────────────────────────────────────
      // SERVICE CHARGE FIELDS (used by ChargeService)
      // ───────────────────────────────────────────

      // PERCENTAGE / FIXED / SLAB
      charge_type: {
        type: DataTypes.ENUM("PERCENTAGE", "FIXED", "SLAB"),
        allowNull: true,
      },

      // For PERCENTAGE
      percentage: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
      },

      // For FIXED
      fixed_amount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
      },

      // For PERCENTAGE rules
      min_charge: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
      },

      max_charge: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
      },

      // GST
      gst_enabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },

      gst_percentage: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 18,
      },

      // SLAB CONFIG (JSON)
      slabs: {
        type: DataTypes.JSON,
        allowNull: true,
      },

      // Active flag
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      }
    },
    {
      tableName: "its_service_types",
      timestamps: false,
      underscored: true,
    }
  );

  return its_service_types;
};
