const express = require("express");
const router = express.Router();

// Sample Route
router.get("/", (req, res) => {
  res.send("Payment API is working!");
});

module.exports = router;
