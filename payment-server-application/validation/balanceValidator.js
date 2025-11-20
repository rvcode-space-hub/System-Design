const walletRepository = require('../repositories/walletRepository');

async function checkSufficientBalance(senderWalletId, amount) {
  const wallet = await walletRepository.findById(senderWalletId);
  if (!wallet) throw new Error('Sender wallet not found');
  const available = parseFloat(wallet.balance) - parseFloat(wallet.locked_balance);
  if (available < parseFloat(amount)) {
    const err = new Error('Insufficient balance');
    err.code = 'INSUFFICIENT_BALANCE';
    throw err;
  }
  return true;
}

module.exports = { checkSufficientBalance };
