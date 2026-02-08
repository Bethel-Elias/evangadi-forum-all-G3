const { StatusCodes } = require("http-status-codes");
const { db } = require("../firebase-admin-config");
const { v4: uuidv4 } = require("uuid");

// Check if Firebase Admin SDK is initialized
function isFirebaseInitialized() {
  return db;
}

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

  // Fallback if Firebase is not initialized
  if (!isFirebaseInitialized()) {
    console.warn("Firebase not initialized, using fallback answer posting");
    const mockAnswerId = uuidv4();
    return res
      .status(StatusCodes.CREATED)
      .json({
        msg: "Answer posted successfully (Firebase fallback mode)",
        answer: {
          answerid: mockAnswerId,
          answer,
          created_at: new Date(),
          username: "Fallback User"
        }
      });
  }

  try {
    const answerId = uuidv4();
    await db.collection("answers").doc(answerId).set({
      answerid: answerId,
      questionid,
      userid,
      answer,
      created_at: new Date(),
    });

    // Get username from users collection
    const userDoc = await db.collection("users").doc(userid).get();
    const username = userDoc.exists ? userDoc.data().username : "Unknown User";

    res.status(StatusCodes.CREATED).json({
      msg: "Answer posted successfully",
      answer: {
        answerid: answerId,
        questionid,
        userid,
        answer,
        created_at: new Date(),
        username: username
      }
    });
  } catch (error) {
    console.error("Post answer error:", error.message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "An unexpected error occurred." });
  }
}

async function getAnswers(req, res) {
  const { questionId } = req.params;

  if (!questionId) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Question ID is required" });
  }

  // Fallback if Firebase is not initialized
  if (!isFirebaseInitialized()) {
    console.warn("Firebase not initialized, using fallback answers");
    return res
      .status(StatusCodes.OK)
      .json({ answers: [], msg: "Firebase fallback mode" });
  }

  try {
    const answersSnapshot = await db
      .collection("answers")
      .where("questionid", "==", questionId)
      .orderBy("created_at", "asc")
      .get();

    const answers = [];
    for (const doc of answersSnapshot.docs) {
      const answer = doc.data();
      // Get username from users collection
      const userDoc = await db.collection("users").doc(answer.userid).get();
      answers.push({
        ...answer,
        username: userDoc.exists ? userDoc.data().username : "Unknown User",
      });
    }

    if (answers.length === 0) {
      return res
        .status(StatusCodes.OK)
        .json({ msg: "No answers found", answers: [] });
    }

    res.status(StatusCodes.OK).json({ answers });
  } catch (error) {
    console.error("Get answers error:", error.message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "An unexpected error occurred." });
  }
}

module.exports = { postAnswer, getAnswers };
