const p2pService = require("../services/transactions/p2pService");
const transactionRepository = require("../repositories/transactionRepository");
const { response, errorResponse } = require("../core/utils/response");

exports.sendMoney = async (req, res, next) => {
  try {
    const { sender_wallet_id, receiver_wallet_id, amount, meta } = req.body;
    const user_id = req.user?.user_id;

    if (!sender_wallet_id || !receiver_wallet_id || !amount) {
      return errorResponse(res, "Missing required fields", 400);
    }

    const result = await p2pService.sendMoney({
      sender_wallet_id,
      receiver_wallet_id,
      amount,
      user_id,
      meta: meta || {},
    });

    return response(res, result, "Transaction successful");
  } catch (err) {
    console.error("Controller Error:", err.message);
    next(err);
  }
};

exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await transactionRepository.findAll();
    return response(res, transactions, "All transactions fetched");
  } catch (err) {
    return errorResponse(res, "Failed to fetch transactions", 500, err.message);
  }
};

exports.getByWallet = async (req, res) => {
  try {
    const { wallet_id } = req.params;
    const transactions = await transactionRepository.findByWalletId(wallet_id);
    return response(res, transactions, "Wallet transactions fetched");
  } catch (err) {
    return errorResponse(res, "Failed to fetch wallet transactions", 500, err.message);
  }
};

exports.getByTransactionId = async (req, res) => {
  try {
    const { transaction_id } = req.params;
    const txn = await transactionRepository.findById(transaction_id);

    if (!txn) return errorResponse(res, "Transaction not found", 404);
    return response(res, txn, "Transaction fetched");
  } catch (err) {
    return errorResponse(res, "Failed to fetch transaction", 500, err.message);
  }
};
