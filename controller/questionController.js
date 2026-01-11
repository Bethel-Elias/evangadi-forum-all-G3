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



















async function singleQuestion(req, res) {
  const { id } = req.params;

  try {
    //get question
    const [rows] = await dbconnection.query(
      `SELECT q.questionid,q.title,q.description,q.created_at, u.username
       FROM questions_Table q
      JOIN users_Table u ON q.userid = u.userid
       WHERE q.questionid = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "The request question could not be found." });
    }

    const question = rows[0];

    //get answer for this question
    const [answers] = await dbconnection.query(
      `SELECT a.answerid, a.answer, a.created_at, u.username
       FROM answers_table a
       JOIN users_Table u ON a.userid = u.userid
       WHERE a.questionid = ?
       ORDER BY a.created_at DESC`,
      [id]
    );

    res.status(StatusCodes.OK).json({ question, answers });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "An unexpected error occurred" });
  }
}

module.exports = { askQuestion, allQuestions, singleQuestion };