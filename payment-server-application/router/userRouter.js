const express = require("express");
const { registerUser, loginUser, updateUser } = require("../controllers/authController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// ✨ NEW: Update user route
router.put("/update/:user_id", updateUser);

module.exports = router;
