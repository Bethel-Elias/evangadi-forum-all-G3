async function checkUser(req, res) {
  const username = req.user.username;
  const userid = req.user.userid;

  return res
    .status(StatusCodes.OK)
    .json({ msg: "Valid user", username, userid });
}
