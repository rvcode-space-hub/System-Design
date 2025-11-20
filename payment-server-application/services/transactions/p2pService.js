const { validateTransaction } = require("../../validation/validationService");
const { sequelize } = require("../../config/DB");
const transactionRepository = require("../../repositories/transactionRepository");
const walletRepository = require("../../repositories/walletRepository");
const CommissionService = require("./commissionService");
const ChargeService = require("./chargeService");
const logger = require("../../config/logger");

const safeNumber = (v) => {
  const n = parseFloat(v);
  return isNaN(n) ? 0 : n;
};

const p2pService = {
  sendMoney: async ({
    sender_wallet_id,
    receiver_wallet_id,
    amount,
    user_id,
    product_profile_id,
    service_type_id,
    meta
  }) => {
    const productProfileId = product_profile_id;
    const serviceTypeId = service_type_id;

    const tx = await sequelize.transaction();
    let txRecord;

    try {
      logger.info("P2P Transfer: Validating input...");
      // Basic Validations
      if (!Number(amount) || amount <= 0) throw new Error("Invalid amount");
      if (sender_wallet_id === receiver_wallet_id)
        throw new Error("Sender and receiver cannot be the same");

      logger.info("P2P Transfer: Running unified transaction validation...");
      await validateTransaction({ sender_wallet_id, receiver_wallet_id, amount, user_id });

      logger.info("P2P Transfer: Calculating commission...");
      const commissionObj = await CommissionService.calculateCommission({
        userId: user_id,
        productProfileId,
        serviceTypeId,
        amount
      });
      const commission = safeNumber(commissionObj?.commission);

      logger.info("P2P Transfer: Calculating service charges...");
      const chargeResult = await ChargeService.calculateCharges({
        amount,
        service_type: "P2P_TRANSFER",
        channel: "WALLET"
      });
      const serviceFee = safeNumber(chargeResult?.totalFee);

      const totalAmountToDebit = safeNumber(amount);

      logger.info("P2P Transfer: Creating transaction record...");
      txRecord = await transactionRepository.create(
        {
          sender_wallet_id,
          receiver_wallet_id,
          amount,
          commission,
          service_fee: serviceFee,
          status: "PROCESSING",
          meta
        },
        tx
      );

      const tx_id = txRecord.transaction_id;

      logger.info("P2P Transfer: Fetching sender wallet...");
      const senderWallet = await walletRepository.findById(sender_wallet_id, { transaction: tx });
      if (!senderWallet) throw new Error("Sender wallet not found");

      const senderPrev = safeNumber(senderWallet.balance);
      if (senderPrev < totalAmountToDebit) throw new Error("Insufficient balance");

      logger.info("P2P Transfer: Locking sender funds...");
      await walletRepository.lockFunds(sender_wallet_id, totalAmountToDebit, tx);

      logger.info("P2P Transfer: Debiting sender wallet...");
      const senderDebitResult = await walletRepository.debit(sender_wallet_id, totalAmountToDebit, tx);
      const senderNew = safeNumber(senderDebitResult.newBalance);

      logger.info("P2P Transfer: Fetching receiver wallet...");
      const receiverWallet = await walletRepository.findById(receiver_wallet_id, { transaction: tx });
      const receiverPrev = safeNumber(receiverWallet?.balance);

      const receiverNetAmount = totalAmountToDebit - commission;
      logger.info(`P2P Transfer: Crediting receiver wallet with ${receiverNetAmount}...`);
      const receiverCreditResult = await walletRepository.credit(receiver_wallet_id, receiverNetAmount, tx);
      const receiverNew = safeNumber(receiverCreditResult.newBalance);

      logger.info("P2P Transfer: Updating transaction status to SUCCESS...");
      await transactionRepository.updateStatus(tx_id, "SUCCESS", tx);

      await tx.commit();
      logger.info("P2P Transfer: Transaction committed successfully.");

      return {
        tx_id,
        status: "SUCCESS",
        transfer_amount: totalAmountToDebit,
        commission,
        service_fee: serviceFee,
        sender_prev_balance: senderPrev,
        sender_new_balance: senderNew,
        receiver_prev_balance: receiverPrev,
        receiver_new_balance: receiverNew
      };

    } catch (err) {
      logger.error("P2P Transfer Error:", err.message);

      try {
        await tx.rollback();
        logger.info("Transaction rolled back.");
      } catch (rollbackErr) {
        logger.error("Rollback failed:", rollbackErr);
      }

      // Update FAILED status if transaction record exists
      try {
        if (txRecord?.transaction_id) {
          await transactionRepository.updateStatus(txRecord.transaction_id, "FAILED", null);
          logger.info("Transaction status updated to FAILED.");
        }
      } catch (innerErr) {
        logger.error("Failed to update transaction to FAILED:", innerErr);
      }

      throw err;
    }
  }
};

module.exports = p2pService;
