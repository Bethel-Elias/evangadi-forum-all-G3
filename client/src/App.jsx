import { Route, Routes, useNavigate } from "react-router-dom";
import { useEffect, useState, createContext } from "react";
import axios from "./axiosconfig";

import "./App.css";

import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Navbar from "./components/Navbar/Navbar";
import AskQuestion from "./pages/AskQuestion/AskQuestion";
import QuestionDetails from "./pages/QuestionDetails/QuestionDetails";
import HowItWorks from "./pages/HowItWorks/HowItWorks";
import Footer from "./components/Footer/Footer";
import ProtectedRoute from "./components/ProtectedRoute.jsx/ProtectedRoute";

export const AppState = createContext();

function App() {
  //to access username globally
  const [user, setuser] = useState(null);

  // checking user for all render
  const [token, setToken] = useState(localStorage.getItem("token"));

  const navigate = useNavigate();

  async function checkUser() {
    try {
      const { data } = await axios.get("/users/check", {
        headers: { Authorization: "Bearer " + token },
      });

      setuser(data);
    } catch (error) {
      console.log(error.response);
      localStorage.removeItem("token");
      setToken(null);
      setuser(null);
      navigate("/login");
    }
  }
  useEffect(() => {
    checkUser();
  }, [token]);

  return (
    <AppState.Provider value={{ user, token, setuser, setToken }}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/ask"
          element={
            <ProtectedRoute>
              <AskQuestion />
            </ProtectedRoute>
          }
        />
        <Route
          path="/questions/:id"
          element={
            <ProtectedRoute>
              <QuestionDetails />
            </ProtectedRoute>
          }
        />
        <Route path="/how-it-works" element={<HowItWorks />} />
      </Routes>
      <Footer />
    </AppState.Provider>
  );
}

export default App;
