const express = require("express");
const { askQuestion } = require("../controllers/qaController");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

router.post("/ask",authenticateToken, askQuestion);

module.exports = router;
