const express = require("express");
const router = express.Router();

const { postAnswer, getAnswers} = require("../controller/answerController");

const authMiddleware = require("../middleware/authMiddleware");

// Post an answer (protected)
router.post("/add", authMiddleware, postAnswer);

// Get answers for a question
router.get("/:questionId", getAnswers);

module.exports = router;
