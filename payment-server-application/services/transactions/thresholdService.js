const { itn_transactions } = require("../config/DB");
const { Op } = require("sequelize");

exports.validateThreshold = async (sender_wallet_id, amount) => {
  if (!sender_wallet_id) throw new Error("Sender wallet is required");
  if (!amount || amount <= 0) throw new Error("Invalid amount");

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const DAILY_LIMIT = 2000;
  const WEEKLY_LIMIT = 10000;
  const MONTHLY_LIMIT = 5000;
  const ANNUAL_LIMIT = 20000;

  const sumAmount = async (condition) => {
    return (await itn_transactions.sum("amount", { where: condition })) || 0;
  };

  // Daily
  const dailyAmount = await sumAmount({
    sender_wallet_id,
    created_at: { [Op.gte]: startOfDay }
  });

  if (dailyAmount + amount > DAILY_LIMIT) throw new Error(`Daily limit exceeded! Allowed: ${DAILY_LIMIT}`);

  // Weekly
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(now.getDate() - 7);

  const weeklyAmount = await sumAmount({
    sender_wallet_id,
    created_at: { [Op.gte]: sevenDaysAgo }
  });

  if (weeklyAmount + amount > WEEKLY_LIMIT) throw new Error(`Weekly limit exceeded! Allowed: ${WEEKLY_LIMIT}`);

  // Monthly
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const monthlyAmount = await sumAmount({
    sender_wallet_id,
    created_at: { [Op.gte]: firstOfMonth }
  });

  if (monthlyAmount + amount > MONTHLY_LIMIT) throw new Error(`Monthly limit exceeded! Allowed: ${MONTHLY_LIMIT}`);

  // Annual
  const firstOfYear = new Date(now.getFullYear(), 0, 1);

  const annualAmount = await sumAmount({
    sender_wallet_id,
    created_at: { [Op.gte]: firstOfYear }
  });

  if (annualAmount + amount > ANNUAL_LIMIT) throw new Error(`Annual limit exceeded! Allowed: ${ANNUAL_LIMIT}`);

  return true;
};

