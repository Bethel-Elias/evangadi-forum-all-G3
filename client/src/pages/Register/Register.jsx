import React, { useRef, useState,useContext } from "react";
import axios from "../../axiosconfig";
import { useNavigate, Link } from "react-router-dom";
import style from "./register.module.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { AppState } from "../../App";

function Register() {
  // Used to move user to another page after successful registration
  const navigate = useNavigate();

  // Global state setters for logged-in user and token
  const { setuser, setToken } = useContext(AppState);

  // Messages for form validation and server responses
  const [errormsg, setErrormsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Controls whether the password is visible or hidden
  const [showPassword, setShowPassword] = useState(false);

  // Toggles password visibility
  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  // References to access input values directly
  const usernameDom = useRef();
  const firstnameDom = useRef();
  const lastnameDom = useRef();
  const emailDom = useRef();
  const passwordDom = useRef();

  // Handles form submission
  async function handleSubmit(e) {
    e.preventDefault();

    // Reset messages each time the form is submitted
    setErrormsg("");
    setSuccessMsg("");

    // Read values from input fields
    const usernameValue = usernameDom.current.value;
    const firstnameValue = firstnameDom.current.value;
    const lastnameValue = lastnameDom.current.value;
    const emailValue = emailDom.current.value;
    const passwordValue = passwordDom.current.value;

    // Check if any field is empty
    if (
      !usernameValue ||
      !firstnameValue ||
      !lastnameValue ||
      !emailValue ||
      !passwordValue
    ) {
      setErrormsg("Please fill out all fields");
      return;
    }

    // Check password length before sending to server
    if (passwordValue.length < 8) {
      setErrormsg("Password must be at least 8 characters long");
      return;
    }

    try {
      // Send registration data to backend API
      const res = await axios.post("/users/register", {
        username: usernameValue,
        firstname: firstnameValue,
        lastname: lastnameValue,
        email: emailValue,
        password: passwordValue,
      });

      // Store returned token and user info in browser storage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Update global application state
      setuser(res.data.user);
      setToken(res.data.token);

      // Show success message
      setSuccessMsg("Registered successfully");
      setErrorMsg("");

      // Redirect user to home page after short delay
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      // Read error message from server response
      const msg = error?.response?.data?.msg || "Something went wrong";

      // If user already exists, show a clear message
      if (
        msg.toLowerCase().includes("exist") ||
        msg.toLowerCase().includes("registered")
      ) {
        setErrorMsg("You already have an account. Please login.");
      } else {
        setErrorMsg("Registration failed. Try again.");
      }
    }
  }

  // Component UI
  return (
    <div className={style.register_page}>
      <div className={style.register_container}>
        <div className={style.register_form}>

          {/* Shows server error messages */}
          {errorMsg && <div className={style.error_msg}>{errorMsg}</div>}

          <h2>Join The Network</h2>

          {/* Link to login page */}
          <div className={style.login_link}>
            Already have an account? <Link to="/login">Login</Link>
          </div>

          {/* Registration form */}
          <form onSubmit={handleSubmit} className={style.form_group}>

            {/* Shows validation messages */}
            {errormsg && <div className={style.Error_msg}>{errormsg}</div>}
            {successMsg && <div className={style.success_msg}>{successMsg}</div>}

            <input ref={usernameDom} type="text" placeholder="username" />

            <div>
              <input ref={firstnameDom} type="text" placeholder="first name" />
              <input ref={lastnameDom} type="text" placeholder="last name" />
            </div>

            <input ref={emailDom} type="email" placeholder="email address" />

            {/* Password input with show/hide toggle */}
            <div style={{ position: "relative", width: "450" }}>
              <input
                ref={passwordDom}
                type={showPassword ? "text" : "password"}
                placeholder="password"
                style={{ width: "100%", paddingRight: "12px" }}
              />

              <span
                onClick={togglePassword}
                style={{
                  position: "absolute",
                  right: "15px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  fontSize: "20px",
                }}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>

            {/* Terms text */}
            <p className={style.terms}>
              I agree to the <Link to="privacy policy">privacy policy</Link> and{" "}
              <Link to="terms of service.">terms of service.</Link>
            </p>

            <button className={style.register_btn} type="submit">
              Agree and Join
            </button>
          </form>
        </div>
      </div>

      {/* Right side informational section */}
      <div className={style.register_info}>
        <span className={style.about}>About</span>
        <h1>Evangadi Networks</h1>
        <p>
          This platform allows students to ask questions and share knowledge.
        </p>
        <p>
          It also helps students practice building real-world full-stack applications.
        </p>

        <Link to="/how-it-works">
          <button className={style.how_btn}>How it works</button>
        </Link>
      </div>
    </div>
  );
}


export default Register;
