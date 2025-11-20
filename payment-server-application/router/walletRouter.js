const express = require('express');
const router = express.Router();
const WalletController = require('../controllers/walletController');

router.post('/create', WalletController.createWallet);
router.get('/:user_id', WalletController.getWallet);
router.get('/', WalletController.getAllWallets);

module.exports = router;
