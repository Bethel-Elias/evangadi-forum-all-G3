import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../axiosconfig";
import { RxAvatar } from "react-icons/rx";
import style from "./questiondetails.module.css";
import Loader from "../../components/Loader/Loader";
import { FaArrowCircleRight, FaRegComment } from "react-icons/fa";
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";

function QuestionDetails() {
  const { id } = useParams();

  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [reactions, setReactions] = useState({});
  const [showComments, setShowComments] = useState(null);
  const [comments, setComments] = useState({});
  const [commentText, setCommentText] = useState({});

  const answerRef = useRef();

  // Read token from localStorage
  const token = localStorage.getItem("token");

  /* ---------------- FETCH QUESTION ---------------- */
  useEffect(() => {
    async function fetchQuestion() {
      try {
        const res = await axios.get(`/questions/${id}`);
        const data = res.data || {};
        setQuestion(data.question || null);
        setAnswers(data.answers || []);
      } catch (error) {
        console.error("Failed to fetch question:", error);
        setQuestion(null);
        setAnswers([]);
      } finally {
        setLoading(false);
      }
    }

    fetchQuestion();
  }, [id]);

  /* ---------------- FETCH REACTIONS ---------------- */
  const fetchReactions = async (answerid) => {
    try {
      const res = await axios.get(`/answers/${answerid}/reactions`);
      setReactions((prev) => ({ ...prev, [answerid]: res.data }));
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------------- LIKE / DISLIKE ---------------- */
  const reactToAnswer = async (answerid, type) => {
    if (!token) return alert("You must be logged in to react.");

    try {
      await axios.post(
        `/answers/${answerid}/reactions`,
        { type },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchReactions(answerid);
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------------- FETCH COMMENTS ---------------- */
  const fetchComments = async (answerid) => {
    try {
      const res = await axios.get(`/answers/${answerid}/comments`);
      setComments((prev) => ({ ...prev, [answerid]: res.data }));
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------------- POST COMMENT ---------------- */
  const postComment = async (answerid) => {
    const text = commentText[answerid]?.trim();
    if (!text) return;

    if (!token) return alert("You must be logged in to comment.");

    try {
      await axios.post(
        `/answers/${answerid}/comments`, //endpoint
        { comment: text }, //body
        { headers: { Authorization: `Bearer ${token}` } } // headers
      );

      setCommentText((prev) => ({ ...prev, [answerid]: "" })); //clear comment input
      fetchComments(answerid); //refresh coments
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------------- POST ANSWER ---------------- */
  const submitAnswer = async (e) => {
    e.preventDefault();

    const answerText = answerRef.current.value.trim();
    if (!answerText) return;

    if (!token) return alert("You must be logged in to post an answer.");

    try {
      const res = await axios.post(
        "/answers",
        { questionid: id, answer: answerText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Add the new answer to the existing answers state
      setAnswers((prev) => [...prev, res.data.answer]);

      // Clear textarea
      answerRef.current.value = "";
    } catch (error) {
      console.error("Failed to submit answer:", error);
    }
  };

  /* ---------------- UI ---------------- */
  if (loading) return <Loader />;
  return (
    <section className={style.questionDetails}>
      {question ? (
        <div className={style.questionSection}>
          <p className={style.question}>Question</p>
          <h2 className={style.questionTitle}>
            <FaArrowCircleRight />
            {question.title}
          </h2>
          <p className={style.questionDescripition}>{question.description}</p>
          <small className={style.questionAskedby}>
            Asked by {question.username}
          </small>
        </div>
      ) : (
        <p className={style.notFoundText}>Question not found</p>
      )}

      <hr className={style.hrLine} />

      <h2 className={style.community}>Answer From The Community</h2>
      <div className={style.answerSection}>
        {Array.isArray(answers) && answers.length > 0 ? (
          answers.map((a) => (
            <div key={a.answerid} className={style.answerCard}>
              <div className={style.answerContent}>
                {/* user */}
                <div className={style.answerUser}>
                  <RxAvatar className={style.avatar} />
                  <span>{a.username}</span>
                </div>
                {/* answer text */}
                <p className={style.answerText}>{a.answer}</p>
              </div>

              {/* REACTIONS */}
              <div className={style.reactionBar}>
                <button onClick={() => reactToAnswer(a.answerid, "like")}>
                  <AiOutlineLike />
                  {reactions[a.answerid]?.find((r) => r.type === "like")
                    ?.count || 0}
                </button>

                <button onClick={() => reactToAnswer(a.answerid, "dislike")}>
                  <AiOutlineDislike />
                  {reactions[a.answerid]?.find((r) => r.type === "dislike")
                    ?.count || 0}
                </button>

                <button
                  onClick={() => {
                    setShowComments(
                      showComments === a.answerid ? null : a.answerid
                    );
                    fetchComments(a.answerid);
                  }}
                >
                  <FaRegComment /> Comment
                </button>
              </div>

              {/* COMMENTS */}
              {showComments === a.answerid && (
                <div className={style.commentSection}>
                  {comments[a.answerid]?.map((c) => (
                    <p key={c.commentid}>
                      <strong>{c.username}:</strong> {c.comment}
                    </p>
                  ))}

                  <textarea
                    value={commentText[a.answerid] || ""}
                    onChange={(e) =>
                      setCommentText((prev) => ({
                        ...prev,
                        [a.answerid]: e.target.value,
                      }))
                    }
                    placeholder="Write a comment..."
                  />

                  <button onClick={() => postComment(a.answerid)}>Post</button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No previous answers posted from Evangadi community.</p>
        )}
      </div>

      <form onSubmit={submitAnswer} className={style.answerForm}>
        <textarea ref={answerRef} placeholder="Your answer..." />
        <button>Post Answer</button>
      </form>
    </section>
  );
}

export default QuestionDetails;
