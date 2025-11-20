const { v4: uuidv4 } = require("uuid");
const walletRepository = require("../../repositories/walletRepository");
const { response, errorResponse } = require("../../core/utils/response");

const safeNumber = (v) => {
  const n = parseFloat(v);
  return isNaN(n) ? 0 : n;
};

const walletService = {

  createWallet: async (
    { user_id, msisdn, user_type, wallet_type = "PRIMARY", balance = 0 },
    transaction = null
  ) => {
    try {
      if (!user_id || !msisdn || !user_type) {
        return errorResponse("Missing required wallet fields");
      }

      const newWallet = await walletRepository.create(
        {
          wallet_id: uuidv4(),
          user_id,
          msisdn,
          user_type,
          wallet_type,
          balance: safeNumber(balance).toFixed(2),
        },
        transaction
      );

      return response(newWallet, "Wallet created successfully");
    } catch (err) {
      return errorResponse(err.message || "Failed to create wallet");
    }
  },


  getWalletByUser: async (user_id) => {
    try {
      const wallet = await walletRepository.findByUserId(user_id);
      if (!wallet) return errorResponse("Wallet not found");

      return response(wallet, "Wallet retrieved successfully");
    } catch (err) {
      return errorResponse(err.message || "Failed to get wallet");
    }
  },

  getAllWallets: async () => {
    try {
      const wallets = await walletRepository.findAll();
      return response(wallets, "All wallets retrieved successfully");
    } catch (err) {
      return errorResponse(err.message || "Failed to get all wallets");
    }
  },


  getBalance: async (walletId, transaction = null) => {
    try {
      const wallet = await walletRepository.findById(walletId, { transaction });
      if (!wallet) return errorResponse("Wallet not found");

      return response(
        {
          balance: safeNumber(wallet.balance),
          locked_balance: safeNumber(wallet.locked_balance),
        },
        "Balance retrieved successfully"
      );
    } catch (err) {
      return errorResponse(err.message || "Failed to get balance");
    }
  },


  debitWithFees: async (walletId, amount, fees = 0, commission = 0, transaction = null) => {
    try {
      const totalDebit = safeNumber(amount) + safeNumber(fees) + safeNumber(commission);
      if (totalDebit <= 0) return errorResponse("Invalid total debit amount");

      // Repository में पहले से wallet validate और balance check होता है
      const result = await walletRepository.debit(walletId, totalDebit, transaction);

      return response(safeNumber(result.newBalance), "Debit with fees successful");
    } catch (err) {
      return errorResponse(err.message || "Failed to debit wallet with fees");
    }
  },


  credit: async (walletId, amount, transaction = null) => {
    try {
      const amt = safeNumber(amount);
      if (amt <= 0) return errorResponse("Invalid amount");

      const result = await walletRepository.credit(walletId, amt, transaction);

      return response(safeNumber(result.newBalance), "Credit successful");
    } catch (err) {
      return errorResponse(err.message || "Failed to credit wallet");
    }
  },


  lockFunds: async (walletId, amount, transaction = null) => {
    try {
      const amt = safeNumber(amount);
      if (amt <= 0) return errorResponse("Invalid lock amount");

      const result = await walletRepository.lockFunds(walletId, amt, transaction);

      return response(result, "Funds locked successfully");
    } catch (err) {
      return errorResponse(err.message || "Failed to lock funds");
    }
  },

  unlockFunds: async (walletId, amount, transaction = null) => {
    try {
      const amt = safeNumber(amount);
      if (amt <= 0) return errorResponse("Invalid unlock amount");

      const result = await walletRepository.unlockFunds(walletId, amt, transaction);

      return response(result, "Funds unlocked successfully");
    } catch (err) {
      return errorResponse(err.message || "Failed to unlock funds");
    }
  },
};

module.exports = walletService;
