

//Ask Question

const askQuestion = async (req, res) => {
  try {
    const { userid, title, description, tag } = req.body;

    if (!userid || !title || !description) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const questionid = uuidv4();

    await db.execute(
      "INSERT INTO questions (questionid, userid, title, description, tag) VALUES (?, ?, ?, ?, ?)",
      [questionid, userid, title, description, tag]
    );

    return res.status(201).json({
      msg: "Question posted successfully",
      questionid,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ msg: "Something went wrong" });
  }
};


// Get single question

const getSingleQuestion = async (req, res) => {
  try {
    const { questionid } = req.params;

    const [rows] = await db.execute(
      `SELECT q.questionid, q.title, q.description, q.tag, q.created_at,
              u.username 
       FROM questions q 
       JOIN users u ON q.userid = u.userid
       WHERE q.questionid = ?`,
      [questionid]
    );

    if (rows.length === 0) {
      return res.status(404).json({ msg: "Question not found" });
    }

    return res.status(200).json(rows[0]);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ msg: "Something went wrong" });
  }
};

module.exports = {
  askQuestion,
  getSingleQuestion,
};
