const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionsController');

// GET all transactions
router.get('/', transactionController.getAllTransactions);

// GET transactions for a specific wallet
router.get('/wallet/:wallet_id', transactionController.getByWallet);

// GET specific transaction by transaction_id
router.get('/:transaction_id', transactionController.getByTransactionId);

module.exports = router;
