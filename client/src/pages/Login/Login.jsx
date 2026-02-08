import React, { useRef, useState, useContext } from "react";
import axios from "../../axiosconfig";
import { useNavigate, Link } from "react-router-dom";
import style from "./login.module.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { AppState } from "../../App";

function Login() {
    const navigate = useNavigate();
    const { setuser, setToken } = useContext(AppState);

    //to give alert for missing info on input
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const emailDom = useRef();
    const passwordDom = useRef();

    //hide and show passwordicon on input tag
    const [showPassword, setShowPassword] = useState(false);
    const togglePassword = () => {
        setShowPassword((prev) => !prev);
    };

    async function handleSubmit(e) {
        e.preventDefault();

      //to give alert for missing info on input
        setErrorMsg("");
        setSuccessMsg("");
    
        const emailValue = emailDom.current.value.trim();
        const passwordValue = passwordDom.current.value.trim();
    
        if (!emailValue || !passwordValue) {
            setErrorMsg("Please fill out all fields!");
            setSuccessMsg("");
            return;
        }

    try {
        const { data } = await axios.post("/users/login", {
            email: emailValue,
            password: passwordValue,
        });

        //token
        localStorage.setItem("token", data.token);
        setToken(data.token); // triggers App re-render
        setuser(data.user); //  navbar updates instantly

        setSuccessMsg("Login successful!");
        setErrorMsg("");

        navigate("/");
    } catch (error) {
        const msg =
            error?.response?.data?.msg || "Something went wrong, please try again";
        setErrorMsg(msg);
        setSuccessMsg("");
        console.log(msg);
    }
    }

    return (
        <div className={style.login_container}>
        {/* left-side */}
        <div className={style.login_left}>
            <div className={style.login_card}>
            <h2>Login to your Account</h2>
            <p>
                Don’t have an account?{" "}
                <Link to="/register">Create a new account</Link>
            </p>

            <form action="" onSubmit={handleSubmit} className={style.form_group}>
              {/* alert message on form */}
                {errorMsg && <div className={style.error_msg}>{errorMsg}</div>}
                {successMsg && (
                    <div className={style.success_msg}>{successMsg}</div>
                )}

                <input
                ref={emailDom}
                type="email"
                name="email"
                placeholder="Enter your Email"
                />
                <div style={{ position: "relative", width: "100%" }}>
                    <input
                    ref={passwordDom}
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    style={{ width: "100%", paddingRight: "12px" }}
                    />
                <span

                onClick={togglePassword}
                style={{
                    position: "absolute",
                    right: "1px",
                    top: "50%",
                    transform: "translateY(-80%)",
                    cursor: "pointer",
                    fontSize: "20px",
                }}
                >
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
                </div>
                <div className={style.forgot}>Forget password?</div>
                <button type="submit" className={style.login_btn}>
                    Login
                </button>
            </form>
            </div>
        </div>

        {/* Right-side*/}
        <div className={style.login_right}>
            <span className={style.about}>About</span>
            <h1>Evangadi Networks</h1>
            <p>
                Evangadi Student Forum is a space where students can ask questions,
                share answers, and support each other throughout their learning
                journey.
            </p>
            <p>
                The forum also gives students hands-on experience building a real-
                world full-stack app using technologies like React, Node.js, and
                MySQL.
            </p>
            <Link to="/how-it-works">
                <button className={style.how_btn}>How it works</button>
            </Link>
        </div>
    </div>
    );
} 

export default Login;
