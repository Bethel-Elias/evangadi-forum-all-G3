const { StatusCodes } = require("http-status-codes");
const dbconnection = require("../db/dbconfig");
const { v4: uuidv4 } = require("uuid");


async function askQuestion(req, res) {
  const { title, description } = req.body;
  const userId = req.user.userid;

  if (!title || !description) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide all required fields" });
  }
  try {
    await dbconnection.query(
      "INSERT INTO questions_Table (questionid, userid, title, description) VALUES (?,?,?,?)",
      [uuidv4(), userId, title, description]
    );

    return res
      .status(StatusCodes.CREATED)
      .json({ msg: "Question created successfully" });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "An unexpected error occurred." });
  }
}










module.exports = { askQuestion, allQuestions, singleQuestion };