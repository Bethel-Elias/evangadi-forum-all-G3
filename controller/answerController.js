// Import database connection
const db = require("../db/dbconfig");
// Import status codes
const { StatusCodes } = require("http-status-codes");
// Import UUID for unique identifiers
const { v4: uuidv4 } = require("uuid");


//============ Post (Create) Answer Controller ============//
const postAnswer = async (req, res) => {
    const { questionid, answer } = req.body;

    // comes from auth middleware
    const userid = req.user.userid; 
    const username = req.user.username;

  // Validate required fields
    if (!answer) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            error: "Bad Request",
            message: "Please provide answer",
        });
    }

    try {
        await dbConnection.query(
        "INSERT INTO answer_table (answerid,userid, questionid, answer) VALUES (?, ?, ?, ?)",
        [uuidv4(),userid, questionid, answer]
    );

    return res.status(StatusCodes.CREATED).json({
        message: "Answer created successfully.",
        answer: {
            userid,questionid,answer,username,created_at: new Date(),
            }
    });
    } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: "Internal Server Error",
        message: "An unexpected error occurred.",
        });
    }
};

module.exports = {
    postAnswer,
};