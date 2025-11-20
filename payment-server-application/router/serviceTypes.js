const express = require("express");
const router = express.Router();
const serviceTypeRepository = require("../repositories/serviceTypeRepository");

// Create service type
router.post("/", async (req, res) => {
  try {
    const data = await serviceTypeRepository.create(req.body);
    res.json({ success: true, message: "Service Type Created", data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
