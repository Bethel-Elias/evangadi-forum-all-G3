import React, { useRef, useState } from "react";
import axios from "../../axiosconfig";
import { useNavigate } from "react-router-dom";
import { FaArrowCircleRight } from "react-icons/fa";
import style from "./askquestion.module.css";

function AskQuestion() {
  const titleRef = useRef();
  const descriptionRef = useRef();
  const navigate = useNavigate();
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  //to give alert for missing info on input
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleAddTag = (e) => {
    e.preventDefault();
    const newTag = tagInput.trim();
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  async function handleSubmit(e) {
    e.preventDefault();

    //to give alert for missing info on input
    setErrorMsg("");
    setSuccessMsg("");

    const titleValue = titleRef.current.value.trim();
    const descriptionValue = descriptionRef.current.value.trim();

    if (!titleValue || !descriptionValue) {
      setErrorMsg("Please fill out all fields!");
      setSuccessMsg("");
      return;
    }

    try {
      await axios.post("/questions/ask", {
        title: titleValue,
        description: descriptionValue,
        tags,
      });

      setSuccessMsg("Inserted successful!");
      setErrorMsg("");

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      const msg =
        error?.response?.data?.msg || "Something went wrong, please try again.";
      setErrorMsg(msg);
      setSuccessMsg("");
      console.log(msg);
    }
  }

  return (
    <>
      {/* steps section */}
      <div className={style.steps_section}>
        <h1>Steps To Write A Good Question:</h1>
        <div className={style.steps_list}>
          <div className={style.step}>
            <FaArrowCircleRight />
            <p>Summerize your problems in a one-line-title.</p>
          </div>
          <div className={style.step}>
            <FaArrowCircleRight />
            <p>Describe your problem in more detail.</p>
          </div>
          <div className={style.step}>
            <FaArrowCircleRight />
            <p> Describe what you tried and what you expected to happen.</p>
          </div>
          <div className={style.step}>
            <FaArrowCircleRight />
            <p>Review your question and post it here.</p>
          </div>
        </div>
      </div>
      <section className={style.ask_question_container}>
        {/* form section */}
        <form onSubmit={handleSubmit} className={style.question_form}>
          {/* alert message on form */}
          {errorMsg && <div className={style.error_msg}>{errorMsg}</div>}
          {successMsg && <div className={style.success_msg}>{successMsg}</div>}

          <h2>Post your Question</h2>
          <input ref={titleRef} placeholder="Question title" />
          <textarea ref={descriptionRef} placeholder="Question details" />

          {/* Tags */}
          <div className={style.tags_input}>
            {tags.map((tag) => (
              <span
                key={tag}
                onClick={() => handleRemoveTag(tag)}
                title="Click to remove"
              >
                {tag} ×
              </span>
            ))}
            <input
              type="text"
              placeholder="Add a tag and press Enter"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddTag(e)}
            />
          </div>

          <button type="submit">Post Question</button>
        </form>
      </section>
    </>
  );
}

export default AskQuestion;
