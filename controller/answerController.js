const { StatusCodes } = require("http-status-codes");
const db = require("../db/dbconfig");
const { v4: uuidv4 } = require("uuid");


//post/add answers
async function postAnswer(req, res){
    const { answer, questionid } = req.body;
    const userid = req.user.userid;

    if (!answer) {
      return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Please provide answers" });
    }

    if (!userid) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: "Authentication required" });
    }


    try {
      await dbconnection.query(
        "INSERT INTO answers_table (answerid, questionid, userid, answer) VALUES (?,?,?,?)",
        [uuidv4(), questionid, userid, answer]
      );

      res.status(StatusCodes.CREATED).json({ msg: "Answer posted successfully" });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "An unexpected error occurred." });
    } 
}

//get answers by question id
    async function getAnswers(req,res){
        res.send("get answer")
    }



module.exports = { postAnswer, getAnswers};