const { StatusCodes } = require("http-status-codes");

// CHECK USER
const checkUser = async (req, res) => {
  try {
    // authMiddleware already verified token & attached req.user
    res.status(200).json({
      message: "Valid user",
      userid: req.user.userid,
      username: req.user.username,
    });
  } catch (error) {
    res.status(401).json({
      message: "Authentication invalid",
    });
  }
};
module.exports = {
  register,
  login,
  checkUser,
};
