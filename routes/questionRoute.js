const express = require("express");
const router = express.Router();

const {askQuestion,allQuestions,singleQuestion} = require("../controller/questionController")

//import authentication middleware
const authMiddleware = require("../middleware/authMiddleware")


router.post("/ask", authMiddleware, askQuestion);

router.get("/all-questions",  allQuestions)

router.get("/:id", singleQuestion)

module.exports = router