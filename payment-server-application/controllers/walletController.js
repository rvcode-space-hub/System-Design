const walletService = require("../services/wallet/walletService");

const walletController = {
  // -----------------------------
  // CREATE WALLET
  // -----------------------------
  createWallet: async (req, res) => {
    const walletData = req.body;
    const result = await walletService.createWallet(walletData);
    res.json(result);
  },

  // -----------------------------
  // GET WALLET BY USER ID
  // -----------------------------
  getWallet: async (req, res) => {
    const { user_id } = req.params;
    const result = await walletService.getWalletByUser(user_id);
    res.json(result);
  },

  // -----------------------------
  // GET ALL WALLETS
  // -----------------------------
  getAllWallets: async (req, res) => {
    const result = await walletService.getAllWallets();
    res.json(result);
  },

  // -----------------------------
  // GET BALANCE
  // -----------------------------
  getBalance: async (req, res) => {
    const { walletId } = req.params;
    const result = await walletService.getBalance(walletId);
    res.json(result);
  },

  // -----------------------------
  // DEBIT WALLET
  // -----------------------------
  debitWithFees: async (req, res) => {
    const { walletId, amount, fees = 0, commission = 0 } = req.body;
    const result = await walletService.debitWithFees(walletId, amount, fees, commission);
    res.json(result);
  },

  // -----------------------------
  // CREDIT WALLET
  // -----------------------------
  credit: async (req, res) => {
    const { walletId, amount } = req.body;
    const result = await walletService.credit(walletId, amount);
    res.json(result);
  },

  // -----------------------------
  // LOCK FUNDS
  // -----------------------------
  lockFunds: async (req, res) => {
    const { walletId, amount } = req.body;
    const result = await walletService.lockFunds(walletId, amount);
    res.json(result);
  },

  // -----------------------------
  // UNLOCK FUNDS
  // -----------------------------
  unlockFunds: async (req, res) => {
    const { walletId, amount } = req.body;
    const result = await walletService.unlockFunds(walletId, amount);
    res.json(result);
  },
};

module.exports = walletController;
