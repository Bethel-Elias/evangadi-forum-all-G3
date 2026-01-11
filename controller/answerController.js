// Import database connection
const dbconnection = require("../db/dbconfig");
// Import HTTP status codes
const { StatusCodes } = require("http-status-codes");

// ============ POST (Create) Answer Controller ============ //
async function postAnswer(req, res) {
  try {
    // Destructure answer and questionid from request body
    const { answer, questionid } = req.body;

    // Get authenticated user's ID from middleware
    const userid = req.user?.userid;

    // Validate required fields
    if (!answer || !questionid) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ msg: "Answer and question ID are required." });
    }

    // Validate authentication
    if (!userid) {
        return res
            .status(StatusCodes.UNAUTHORIZED)
            .json({ msg: "Authentication required." });
    }

    // Insert the new answer into database
    const [result] = await dbconnection.query(
        "INSERT INTO answers_table (questionid, userid, answer) VALUES (?,?,?)",
        [questionid, userid, answer]
    );

    // Fetch the newly created answer with user information
    const [newAnswer] = await dbconnection.query(
        `
        SELECT 
            a.answerid,
            a.answer,
            a.created_at,
            u.username
        FROM answers_table a
        JOIN users_Table u ON a.userid = u.userid
        WHERE a.answerid = ?
        `,
        [result.insertId]
    );

    // Send back the newly created answer
    return res.status(StatusCodes.CREATED).json({
        msg: "Answer posted successfully",
        answer: newAnswer[0],
    });

} catch (error) {
    console.error("Post Answer Error:", error);

    return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ msg: "An unexpected error occurred." });
}
}

module.exports = postAnswer;
