import React, { useContext, useEffect, useState } from "react";
import { AppState } from "../../App";
import { Link } from "react-router-dom";
import axios from "../../axiosconfig";
import { RxAvatar } from "react-icons/rx";
import style from './home.module.css'
import { MdKeyboardArrowRight } from "react-icons/md";


function Home() {
  const { user } = useContext(AppState);

  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const { data } = await axios.get("/questions/all-questions");
        setQuestions(data.questions);
        // console.log(res.data);
      } catch (err) {
        console.error("Failed to fetch questions:", err);
      }
    };
    fetchQuestions();
  }, []);

  return (
    <div className={style.home_container}>
      <div className={style.home_header}>
        <button className={style.ask_btn}>
          <Link to="/ask">Ask a Question</Link>
        </button>
        <h3>Hello: {user?.username}</h3>
      </div>

      <hr />
      <div className={style.question_list}>
        {Array.isArray(questions) &&
          questions.map((q) => (
            <Link
              key={q.questionid}
              to={`/questions/${q.questionid}`}
              className={style.question_link}
            >
              <div className={style.question_card}>
                <div className={style.question_left}>
                  <RxAvatar className={style.avatar} />
                  <p className={style.username}>{q.username}</p>
                </div>
                <div className={style.question_right}>
                  <h4>{q.title}</h4>
                </div>
                <div className={style.question_arrow}>
                  <MdKeyboardArrowRight />
                </div>
              </div>
              <hr />
            </Link>
          ))}
      </div>
    </div>
  );
}
export default Home;
