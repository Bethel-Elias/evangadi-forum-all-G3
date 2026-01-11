// Import database connection
const dbconnection = require("../db/dbconfig");
// Import status codes
const { StatusCodes } = require("http-status-codes");
// Import UUID for unique identifiers
const { v4: uuidv4 } = require("uuid");


//============ Post (Create) Answer Controller ============//
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
    const [result] = await dbconnection.query(
        "INSERT INTO answers_table (questionid, userid, answer) VALUES (?,?,?)",
        [questionid, userid, answer]
    );

    const [newAnswer] = await dbconnection.query(
        `SELECT 
        a.answerid,
        a.answer,
        a.created_at,
        u.username
    FROM answers_table a
    JOIN users_Table u ON a.userid = u.userid
    WHERE a.answerid = ?`,
    [result.insertId]
    );

    res.status(201).json({ answer: newAnswer[0] });

    res.status(StatusCodes.CREATED).json({ msg: "Answer posted successfully" });
} catch (error) {
    res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ msg: "An unexpected error occurred." });
    }
}