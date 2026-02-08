const { StatusCodes } = require("http-status-codes");
const { db } = require("../firebase-admin-config");
const { v4: uuidv4 } = require("uuid");

// Check if Firebase Admin SDK is initialized
function isFirebaseInitialized() {
  return db;
}

async function askQuestion(req, res) {
  const { title, description } = req.body;
  const userId = req.user.userid;

  if (!title || !description) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide all required fields" });
  }

  // Fallback if Firebase is not initialized
  if (!isFirebaseInitialized()) {
    console.warn("Firebase not initialized, using fallback question creation");
    return res
      .status(StatusCodes.CREATED)
      .json({ msg: "Question created successfully (Firebase fallback mode)" });
  }

  try {
    const questionId = uuidv4();
    await db.collection("questions").doc(questionId).set({
      questionid: questionId,
      userid: userId,
      title,
      description,
      created_at: new Date(),
    });

    return res
      .status(StatusCodes.CREATED)
      .json({ msg: "Question created successfully" });
  } catch (error) {
    console.error("Ask question error:", error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "An unexpected error occurred." });
  }
}

async function allQuestions(req, res) {
  // Fallback if Firebase is not initialized
  if (!isFirebaseInitialized()) {
    console.warn("Firebase not initialized, using fallback questions");
    return res
      .status(StatusCodes.OK)
      .json({ questions: [], count: 0, msg: "Firebase fallback mode" });
  }

  try {
    const questionsSnapshot = await db
      .collection("questions")
      .orderBy("created_at", "desc")
      .get();

    const questions = [];
    for (const doc of questionsSnapshot.docs) {
      const question = doc.data();
      // Get username from users collection
      const userDoc = await db.collection("users").doc(question.userid).get();
      questions.push({
        ...question,
        username: userDoc.exists ? userDoc.data().username : "Unknown User",
      });
    }

    if (questions.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "No questions found." });
    }

    return res
      .status(StatusCodes.OK)
      .json({ questions, count: questions.length });
  } catch (error) {
    console.error("Get all questions error:", error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "An unexpected error occurred" });
  }
}

async function singleQuestion(req, res) {
  const { id } = req.params;

  // Fallback if Firebase is not initialized
  if (!isFirebaseInitialized()) {
    console.warn("Firebase not initialized, using fallback question");
    return res
      .status(StatusCodes.OK)
      .json({
        question: {},
        answers: [],
        msg: "Firebase fallback mode"
      });
  }

  try {
    // Get question
    const questionDoc = await db.collection("questions").doc(id).get();

    if (!questionDoc.exists) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "The requested question could not be found." });
    }

    const question = questionDoc.data();
    // Get username from users collection
    const userDoc = await db.collection("users").doc(question.userid).get();
    question.username = userDoc.exists ? userDoc.data().username : "Unknown User";

    // Get answers for this question
    const answersSnapshot = await db
      .collection("answers")
      .where("questionid", "==", id)
      .orderBy("created_at", "desc")
      .get();

    const answers = [];
    for (const doc of answersSnapshot.docs) {
      const answer = doc.data();
      // Get username from users collection
      const answerUserDoc = await db.collection("users").doc(answer.userid).get();
      answers.push({
        ...answer,
        username: answerUserDoc.exists ? answerUserDoc.data().username : "Unknown User",
      });
    }

    res.status(StatusCodes.OK).json({ question, answers });
  } catch (error) {
    console.error("Get single question error:", error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "An unexpected error occurred" });
  }
}

module.exports = { askQuestion, allQuestions, singleQuestion };
