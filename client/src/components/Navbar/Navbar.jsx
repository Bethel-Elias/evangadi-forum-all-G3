import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../axiosconfig";
import "./navbar.css";
import { AppState } from "../../App";

function Navbar() {
  const navigate = useNavigate();

  const { user, setuser, setToken } = useContext(AppState);

  const logout = () => {
    localStorage.removeItem("token"); // ✅ remove token
    delete axios.defaults.headers.common["Authorization"]; // optional
    setToken(null); // update state so navbar re-renders
    setuser(null);
    navigate("/login", { replace: true });
  };

  return (
    <nav>
      <div>
        <img src="/10001.png" alt="logo" />
      </div>
      <div>
        <Link to="/">Home</Link>
        <Link to="/how-it-works">How it Works</Link>

        {!user ? (
          <button onClick={() => navigate("/login")}>Sign In</button>
        ) : (
          <>
            <Link to="/ask">Ask Question</Link>
            <button onClick={logout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
