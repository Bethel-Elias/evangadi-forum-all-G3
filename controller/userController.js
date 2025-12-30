const dbconnection = require("../db/dbconfig");
const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const util = require("util");

// Promisify dbconnection.query for async/await usage
const query = util.promisify(dbconnection.query).bind(dbconnection);

// ========== REGISTER ==========
async function register(req, res) {
  const { username, firstname, lastname, email, password } = req.body;
  if (!username || !firstname || !lastname || !email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide all required fields" });
  }

  try {
    const [user] = await dbconnection.query(
      "SELECT username, userid FROM users_Table WHERE username=? OR email=?",
      [username, email]
    );

    if (user.length > 0) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ msg: "User already exists" });
    }

    if (password.length <= 8) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Password must be at least 8 characters" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await dbconnection.query(
      "INSERT INTO users_Table(username, firstname, lastname, email, password) VALUES (?, ?, ?, ?, ?)",
      [username, firstname, lastname, email, hashedPassword]
    );

    return res
      .status(StatusCodes.CREATED)
      .json({ msg: "User registered successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "An unexpected error occurred." });
  }
}

// ========== LOGIN ==========
async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Email and password required" });
  }

  try {
    const [rows] = await dbconnection.query(
      "SELECT userid, username, email, password FROM users_Table WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: "Invalid credentials" });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userid: user.userid, username: user.username, email: user.email },
      process.env.JWT_SECRET || "SECRET_KEY",
      { expiresIn: "1d" }
    );

    delete user.password;

    return res
      .status(StatusCodes.OK)
      .json({ msg: "Login successful", token, user });
  } catch (err) {
    console.error(err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Server error" });
  }
}

// ========== CHECK LOGGED-IN USER ==========
async function checkUser(req, res) {
  const username = req.user.username;
  const userid = req.user.userid;

  return res
    .status(StatusCodes.OK)
    .json({ msg: "Valid user", username, userid });
}

module.exports = { register, login, checkUser };
