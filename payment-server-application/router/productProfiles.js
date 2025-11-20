const express = require("express");
const router = express.Router();
const db = require("../config/DB");
const its_product_profiles = db.models.its_product_profiles;

// Create product profile
router.post("/", async (req, res) => {
  try {
    const data = await its_product_profiles.create(req.body);
    res.json({ success: true, message: "Product Profile Created", data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
