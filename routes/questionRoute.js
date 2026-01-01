const express = require("express");
const router = express.Router();

const {
  askQuestion,
  getSingleQuestion,
} = require("../controller/questionController");

// POST → create a new question
router.post("/ask", askQuestion);


// GET → get a single question by questionid (UUID)
router.get("/:questionid", getSingleQuestion);

module.exports = router;
