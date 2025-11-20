const db = require('../config/DB');
const itn_transactions = db.models.itn_transactions;
const { Op } = require("sequelize");

const transactionRepository = {
  // Create a new transaction
  create: async (payload, transaction = null) => {
    return itn_transactions.create(payload, { transaction });
  },

  // Update transaction status
  updateStatus: async (txId, status, transaction = null) => {
    const [count, rows] = await itn_transactions.update(
      { status },
      {
        where: { transaction_id: txId },
        transaction,
        returning: true
      }
    );
    return rows[0] || null;
  },

  // Find transaction by primary key
  findById: async (txId, options = {}) => {
    return itn_transactions.findByPk(txId, options);
  },

  // Find all transactions for a given wallet (sender or receiver)
  findByWalletId: async (wallet_id, options = {}) => {
    return itn_transactions.findAll({
      where: {
        [Op.or]: [
          { sender_wallet_id: wallet_id },
          { receiver_wallet_id: wallet_id }
        ]
      },
      order: [["created_at", "DESC"]],
      ...options
    });
  },

  // Find all transactions
  findAll: async (options = {}) => {
    return itn_transactions.findAll({
      order: [["created_at", "DESC"]],
      ...options
    });
  },

  // Optional: find transactions by status or date range
  findByFilters: async ({ wallet_id, status, fromDate, toDate } = {}, options = {}) => {
    const where = {};

    if (wallet_id) {
      where[Op.or] = [
        { sender_wallet_id: wallet_id },
        { receiver_wallet_id: wallet_id }
      ];
    }

    if (status) {
      where.status = status;
    }

    if (fromDate || toDate) {
      where.created_at = {};
      if (fromDate) where.created_at[Op.gte] = fromDate;
      if (toDate) where.created_at[Op.lte] = toDate;
    }

    return itn_transactions.findAll({
      where,
      order: [["created_at", "DESC"]],
      ...options
    });
  }
};

module.exports = transactionRepository;


