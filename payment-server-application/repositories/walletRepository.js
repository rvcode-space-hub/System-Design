const db = require('../config/DB');
const itn_wallets = db.models.itn_wallets;

const sanitizeWallet = (wallet) => {
  if (!wallet) return null;

  let balance = parseFloat(wallet.balance);
  let locked = parseFloat(wallet.locked_balance);

  if (isNaN(balance)) balance = 0;
  if (isNaN(locked)) locked = 0;

  if (balance < 0) balance = 0;
  if (locked < 0) locked = 0;
  if (locked > balance) locked = 0;

  wallet.balance = Number(balance.toFixed(2));
  wallet.locked_balance = Number(locked.toFixed(2));

  return wallet;
};

const validateAmount = (amount) => {
  const amt = parseFloat(amount);
  if (isNaN(amt)) throw new Error("Amount must be numeric");
  if (amt <= 0) throw new Error("Amount must be greater than 0");
  return amt;
};

const getWallet = async (walletId, transaction, requireBalance = true) => {
  let wallet = await itn_wallets.findByPk(walletId, {
    transaction,
    lock: transaction?.LOCK?.UPDATE,
  });

  wallet = sanitizeWallet(wallet);

  if (!wallet) throw new Error("Wallet not found");

  if (requireBalance && wallet.balance <= 0)
    throw new Error("Wallet balance not found or insufficient");

  return wallet;
};

const walletRepository = {
  findById: async (id, options = {}) => {
    const wallet = await itn_wallets.findByPk(id, options);
    return sanitizeWallet(wallet);
  },

  findByUserId: async (userId, options = {}) => {
    const wallet = await itn_wallets.findOne({
      where: { user_id: userId },
      ...options,
    });
    return sanitizeWallet(wallet);
  },

  findAll: async (options = {}) => {
    const wallets = await itn_wallets.findAll(options);
    return wallets.map(sanitizeWallet);
  },

  create: async (payload, options = {}) =>
    itn_wallets.create(payload, options),

  debit: async (walletId, amount, transaction) => {
    const amt = validateAmount(amount);
    const wallet = await getWallet(walletId, transaction);

    if (wallet.balance < amt) throw new Error("Insufficient balance");

    const prevBalance = wallet.balance;
    wallet.balance = Number((wallet.balance - amt).toFixed(2));
    await wallet.save({ transaction });

    return { prevBalance, newBalance: wallet.balance };
  },

  debitWithFees: async (walletId, amount, commission = 0, serviceFee = 0, transaction) => {
    const totalDebit = Number(amount) + Number(commission) + Number(serviceFee);
    if (totalDebit <= 0) throw new Error("Invalid total debit amount");

    const wallet = await getWallet(walletId, transaction);

    if (wallet.balance < totalDebit) throw new Error("Insufficient balance");

    const prevBalance = wallet.balance;
    wallet.balance = Number((wallet.balance - totalDebit).toFixed(2));
    await wallet.save({ transaction });

    return { prevBalance, newBalance: wallet.balance };
  },

  credit: async (walletId, amount, transaction) => {
    const amt = validateAmount(amount);
    const wallet = await getWallet(walletId, transaction, false); // credit does not require balance

    const prevBalance = wallet.balance;
    wallet.balance = Number((wallet.balance + amt).toFixed(2));
    await wallet.save({ transaction });

    return { prevBalance, newBalance: wallet.balance };
  },

  lockFunds: async (walletId, amountToLock, transaction) => {
    const amt = validateAmount(amountToLock);
    const wallet = await getWallet(walletId, transaction);

    if (wallet.balance < amt)
      throw new Error("Insufficient balance to lock");

    wallet.balance = Number((wallet.balance - amt).toFixed(2));
    wallet.locked_balance = Number((wallet.locked_balance + amt).toFixed(2));

    await wallet.save({ transaction });
    return wallet;
  },

  unlockFunds: async (walletId, amount, transaction) => {
    const amt = validateAmount(amount);
    const wallet = await getWallet(walletId, transaction, false); // unlocking does not require positive balance

    wallet.balance = Number((wallet.balance + amt).toFixed(2));
    wallet.locked_balance = Number((wallet.locked_balance - amt).toFixed(2));

    if (wallet.locked_balance < 0) wallet.locked_balance = 0;

    await wallet.save({ transaction });
    return wallet;
  },
};

module.exports = walletRepository;
