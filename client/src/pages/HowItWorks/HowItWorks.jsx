import React from "react";
import style from "./howitworks.module.css";

function HowItWorks() {
  return (
    <>
      <div className={style.howitworks}>
        <h1>How to Use Evangadi Networks Q&A</h1>
        <div>
          <h2>User Registration</h2>
          <h3>
            To join Evangadi Networks Q&A, you need to create an account. Follow
            these steps:
          </h3>
          <p>Click on the "Sign In" button in the top-right corner.</p>
          <p>Switch to the "Create a new account" form.</p>
          <p>
            Fill in the required fields: Username, First Name, Last Name, Email,
            and Password.
          </p>
          <p>Click on the "Agree and Join" button to register.</p>
          <p>
            You will receive a confirmation message upon successful
            registration.
          </p>
        </div>
        <div>
          <h2>User Login</h2>
          <h3>Once you have registered, you can log in to your account:</h3>
          <p>Click on the "Sign In" button in the top-right corner.</p>
          <p>Enter your registered Email and Password.</p>
          <p>Click on the "Login" button to access your account.</p>
        </div>
        <div>
          <h2>Asking a Question</h2>
          <h3>To ask a new question:</h3>
          <p>
            After logging in, click on the "Ask Question" button on the Home
            page.
          </p>
          <p>
            Fill in the "Title" and "Description" fields with your question
            details.
          </p>
          <p>Click on the "Post Your Question" button to submit.</p>
          <p>
            Your question will appear on the Home page for the community to view
            and answer.
          </p>
        </div>
        <div>
          <h2>Viewing Questions and Answers</h2>
          <h3>To browse and view questions and their answers:</h3>
          <p>Navigate to the Home page to see a list of recent questions.</p>
          <p>
            Click on a question title to view its details and existing answers.
          </p>
          <p>
            If there are no answers, you'll see a prompt encouraging you to
            answer.
          </p>
        </div>
        <div>
          <h2>Submitting an Answer</h2>
          <h3>To answer a question:</h3>
          <p>Navigate to the question you want to answer.</p>
          <p>Scroll down to the "Answer The Top Question" section.</p>
          <p>Type your answer in the provided textarea.</p>
          <p>Click on the "Post Your Answer" button to submit.</p>
          <p>Your answer will appear under the community answers section.</p>
        </div>
        <div>
          <h2>Logging Out</h2>
          <h3>To securely log out of your account:</h3>
          <p>
            Click on the "Logout" button located in the header/navigation bar.
          </p>
          <p>
            This will clear your session and redirect you to the login page.
          </p>
        </div>
        <div>
          <h2>Support and Feedback</h2>
          <h3>Support and Feedback</h3>
          <p>Contact our support team through the "About" page.</p>
          <p>
            Provide feedback using the feedback form available in your profile.
          </p>
        </div>
      </div>
    </>
  );
}

export default HowItWorks;
