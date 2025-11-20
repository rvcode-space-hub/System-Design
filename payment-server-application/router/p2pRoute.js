const express = require("express");
const router = express.Router();
const p2pController = require("../controllers/p2pController");
const authenticate = require("../middleware/authMiddleware");

router.post("/transfer", authenticate, p2pController.sendMoney);

module.exports = router;
