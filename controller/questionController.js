const db = require("../db/dbconfig");
const { v4: uuidv4 } = require("uuid");

// GET ALL QUESTIONS

exports.getAllQuestions = async (req, res) => {
  try {
    const sql = `
      SELECT 
        questions.questionid,
        questions.title,
        questions.description,
        questions.tag,
        users.username
      FROM questions
      JOIN users ON questions.userid = users.userid
      ORDER BY questions.id DESC
    `;

    const [rows] = await db.query(sql);

    res.status(200).json(rows);
  } catch (err) {
    console.error("FULL SQL ERROR:", err);
    res.status(500).json({ message: "Database error" });
  }
};




// UPDATE QUESTION

exports.updateQuestion = async (req, res) => {
  const { id } = req.params;
  const { title, description, tag } = req.body;

  try {
    const sql = `
      UPDATE questions
      SET title = ?, description = ?, tag = ?
      WHERE questionid = ?
    `;

    await db.query(sql, [title, description, tag, id]);

    res.status(200).json({ message: "Question updated successfully" });
  } catch (err) {
    console.error("DB Error:", err);
    res.status(500).json({ message: "Database error" });
  }
};


// DELETE QUESTION

exports.deleteQuestion = async (req, res) => {
  const { id } = req.params;

  try {
    const sql = "DELETE FROM questions WHERE questionid = ?";
    await db.query(sql, [id]);

    res.status(200).json({ message: "Question Deleted" });
  } catch (err) {
    console.error("DB Error:", err);
    res.status(500).json({ message: "Database error" });
  }
};
