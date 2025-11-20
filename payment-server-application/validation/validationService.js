const { checkSufficientBalance } = require('./balanceValidator');
const { checkDailyLimit } = require('./limitValidator');
const { runFraudChecks } = require('./fraudValidator');

async function validateTransaction(payload) {
  await runFraudChecks(payload);
  await checkSufficientBalance(payload.sender_wallet_id, payload.amount);
  await checkDailyLimit(payload.user_id, payload.amount);
  return true;
}

module.exports = { validateTransaction };
