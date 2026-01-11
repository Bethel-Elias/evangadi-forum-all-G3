async function allQuestions(req, res) {
  try {
    const [questions] = await dbconnection.query(
      `SELECT q.questionid, q.title, q.description, q.created_at,
              u.username
       FROM questions_Table q
       JOIN users_Table u ON q.userid = u.userid
       ORDER BY q.created_at DESC`
    );

    if (!questions || questions.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "No questions found." });
    }

    return res
      .status(StatusCodes.OK)
      .json({ questions, count: questions.length });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "An unexpected error occurred" });
  }
}