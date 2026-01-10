const { StatusCodes } = require("http-status-codes");
const dbconnection = require("../db/dbconfig");









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
       ORDER BY a.created_at ASC`,
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
