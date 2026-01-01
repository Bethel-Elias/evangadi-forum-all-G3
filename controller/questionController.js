<<<<<<< HEAD

const { StatusCodes } = require("http-status-codes");
const dbconnection = require("../db/dbconfig")
const { v4: uuidv4 } = require("uuid");


async function askQuestion(req,res){

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


async function allQuestions(req,res){

    

    try {
      const [questions] = await dbconnection.query(
        `SELECT q.questionid, q.title, q.description, q.created_at,
              u.username
       FROM questions_Table q
       JOIN users_Table u ON q.userid = u.userid
       ORDER BY q.created_at DESC`
      );


      if ( !questions || questions.length === 0) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ msg: "No questions found." });
      }

       return res.status(StatusCodes.OK).json({questions, count: questions.length,});

      

    } catch (error) {
        
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "An unexpected error occurred" });
    }  

}


async function singleQuestion(req, res) {
  
    const { id } = req.params;

    
    try {
      const [rows] = await dbconnection.query(
        `SELECT q.questionid,q.title,q.description,q.created_at, u.username
       FROM questions_Table q
      JOIN users_Table u ON q.userid = u.userid
       WHERE q.questionid = ?`,
        [id]
      );

      if (rows.length === 0) {
        return res.status(StatusCodes.NOT_FOUND).json({ msg: "The request question could not be found." });
      }

      

       return res.status(StatusCodes.OK).json(rows[0]);

    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "An unexpected error occurred" });
    }
}
=======
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









>>>>>>> myfork/main



module.exports = { askQuestion, allQuestions, singleQuestion };