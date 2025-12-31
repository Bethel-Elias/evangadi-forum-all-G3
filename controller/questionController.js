const { StatusCodes } = require("http-status-codes");
const dbconnection = require("../db/dbconfig");
const { v4: uuidv4 } = require("uuid");

/**
 * CREATE QUESTION
 */
const askQuestion = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user.userid;
    const questionId = uuidv4();

    if (!title || !description) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Title and description are required"
      });
    }

    await dbconnection.query(
      `
      INSERT INTO questions (question_id, user_id, title, content)
      VALUES (?, ?, ?, ?)
      `,
      [questionId, userId, title, description]
    );

    res.status(StatusCodes.CREATED).json({
      message: "Question added successfully",
      question_id: questionId
    });

  } catch (error) {
    console.error("ASK QUESTION ERROR:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: error.message
    });
  }
};












module.exports = { askQuestion, allQuestions, singleQuestion };