const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    port: process.env.DB_PORT || 3306,
    logging: false,
  }
);

// Load Models
const itn_wallets = require('../models/itn_wallets')(sequelize, DataTypes);
const itn_transactions = require('../models/itn_transactions')(sequelize, DataTypes);
const its_product_profiles = require('../models/its_product_profiles')(sequelize, DataTypes);
const its_service_types = require('../models/its_service_types')(sequelize, DataTypes);
const itn_channel_users = require('../models/itn_channel_users')(sequelize, DataTypes);

// Export as SINGLE OBJECT
module.exports = {
  sequelize,               // <--- important!
  models: {
    itn_wallets,
    itn_transactions,
    its_product_profiles,
    its_service_types,
    itn_channel_users,
  }
};

console.log("✅ Models loaded:", Object.keys(module.exports.models));
