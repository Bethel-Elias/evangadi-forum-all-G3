const dbconnection = require("../db/dbconfig");
const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

// register
async function register(req, res) {
  const { username, firstname, lastname, email, password } = req.body;

  if (!email || !password || !firstname || !lastname || !username) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "please provide all required fields" });
  }

  try {
    const [user] = await dbConnection.query(
      "select username, userid from users where username = ? or email = ?",
      [username, email]
    );

    if (user.length > 0) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ msg: "user already existed" });
    }

    if (password.length < 8) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "password must be at least 8 characters" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await dbConnection.query(
      "insert into users (username, firstname, lastname, email, password) values (?,?,?,?,?)",
      [username, firstname, lastname, email, hashedPassword]
    );

    return res
      .status(StatusCodes.CREATED)
      .json({ msg: "user registered successfully" });
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "something went wrong, try again later" });
  }
}










module.exports = { register, login, checkUser };