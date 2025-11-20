const DAILY_LIMIT = 100000; 
const transactionRepository = require('../repositories/transactionRepository');

async function checkDailyLimit(userId, amount) {
  if (parseFloat(amount) > DAILY_LIMIT) {
    const err = new Error('Amount exceeds daily limit');
    err.code = 'LIMIT_EXCEEDED';
    throw err;
  }
  return true;
}

module.exports = { checkDailyLimit };
