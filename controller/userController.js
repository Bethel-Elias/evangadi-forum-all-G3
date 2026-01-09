const dbconnection = require("../db/dbconfig");
const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");


//register


async function register(req, res) {
  //user missed some information
  const { username, firstname, lastname, email, password } = req.body;
  if (!username || !firstname || !lastname || !email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide all required fields" });
  }

  try {
    //if username or email exists
    const [user] = await dbconnection.query(
      "SELECT username,userid FROM users_Table WHERE username=? or email=?",
      [username, email]
    );
    if (user.length > 0) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ msg: "User already existed" });
    }

    //to check password length
    if (password.length <= 8) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Password must be at least 8 characters" });
    }

    //encrypt/hide db table password
    const salt = await bcrypt.genSalt(10);

    const hashedpassword = await bcrypt.hash(password, salt);

    //user inserted all information
    await dbconnection.query(
      "INSERT INTO users_Table(username, firstname, lastname, email, password) values (?,?,?,?,?)",
      [username, firstname, lastname, email, hashedpassword]
    );
    return res
      .status(StatusCodes.CREATED)
      .json({ msg: "User registered successfully" });
  } catch (error) {
    //for server error
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "An unexpected error occurred." });
  }
}
//Login 

async function login(req, res) {
  //not providing all information
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide all required fields" });
  }

  try {
    //if user doesnot exist
    const [user] = await dbconnection.query(
      "SELECT username,userid,password FROM users_Table WHERE email=?",
      [email]
    );

    if (user.length == 0) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: "Invalid username or password or credintial" });
    }

    //if user exists compare encrypted password with sent password
    const ismatch = await bcrypt.compare(password, user[0].password);
    if (!ismatch) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: "Invalid username or password or credintial" });
    }
    //if ismatch => JWT(json web token)

    const username = user[0].username;
    const userid = user[0].userid;

    const token = jwt.sign({ username, userid }, process.env.DB_JWT_SECRET, {
      expiresIn: "1d",
    });

    return res
      .status(StatusCodes.OK)
      .json({ msg: "User login successful", token, username });
  } catch (error) {
    //server error
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "An unexpected error occurred" });
  }
}




module.exports = { register, login, checkUser };