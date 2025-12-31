const db = require("../db/dbconfig")
const { v4: uuidv4 } = require("uuid");

// GET ALL QUESTIONS
exports.getAllQuestions = (req, res) => {
  const sql = `
    SELECT 
      questions.id,
      questions.title,
      questions.description,
      questions.created_at,
      users.username
    FROM questions
    JOIN users ON questions.user_id = users.id
    ORDER BY questions.created_at DESC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    res.status(200).json(result);
  });
};



// UPDATE QUESTION

exports.updateQuestion = (req, res) => {
 const {id} = req.params.id}

const sql = "UPDATE FROM questions WHERE id = ?";

  db.query(sql, [id], (err) => {
    if (err) {
      return res.status(500).json({ message: "Database error" });
    }

    res.status(200).json({ message: "Question Updated" });
  });




// DELETE QUESTION
exports.deleteQuestion = (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM questions WHERE id = ?";

  db.query(sql, [id], (err) => {
    if (err) {
      return res.status(500).json({ message: "Database error" });
    }

    res.status(200).json({ message: "Question Deleted" });
  });
};