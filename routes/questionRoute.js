const express = require('express');
const router = express.Router();

const {
    createQuestion,
    getAllQuestions,
    getSingleQuestion,
    updateQuestion,
    deleteQuestion
} = require("../controllers/questioncontroller");

// Create a question
router.post("/", createQuestion);

// Get all questions
router.get("/", getAllQuestions);

// Update a question
router.put("/:id", updateQuestion);

// Delete a question
router.delete("/:id", deleteQuestion);

module.exports = router;