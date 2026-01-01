const { StatusCodes } = require("http-status-codes");
const dbconnection = require("../db/dbconfig");
<<<<<<< HEAD
// const { v4: uuidv4 } = require("uuid");

//post/add answers
async function postAnswer(req, res) {
  const { answer, questionid } = req.body;
  const userid = req.user.userid;

  if (!answer || !questionid) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide answers" });
  }

  if (!userid) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "Authentication required" });
  }

  try {
    await dbconnection.query(
      "INSERT INTO answers_table (questionid, userid, answer) VALUES (?,?,?)",
      [questionid, userid, answer]
    );

    res.status(StatusCodes.CREATED).json({ msg: "Answer posted successfully" });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "An unexpected error occurred." });
  }
}

//get answers by question id
async function getAnswers(req, res) {
  const { questionId } = req.params;

  if (!questionId) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Question ID is required" });
  }

  try {
    const [answers] = await dbconnection.query(
      `SELECT 
         a.answerid,
         a.answer,
         a.created_at,
         u.username
       FROM answers_table a
       JOIN users_table u ON a.userid = u.userid
       WHERE a.questionid = ?
       ORDER BY a.created_at DESC`,
      [questionId]
    );

    if (answers.length === 0) {
      return res
        .status(StatusCodes.OK)
        .json({ msg: "No answers found", answers: [] });
    }

    res.status(StatusCodes.OK).json({ answers });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "An unexpected error occurred." });
  }
}

module.exports = { postAnswer, getAnswers };
=======



















module.exports = { postAnswer, getAnswers };
>>>>>>> myfork/main
