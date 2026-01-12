
const { StatusCodes } = require("http-status-codes");
const dbconnection = require("../db/dbconfig");




//post/add like/unluke to answers
async function reactAnswer(req, res) {
  const { type } = req.body; //like or dislike
  const answerId = req.params.id;
  const userId = req.user.id;

  if (!["like", "dislike"].includes(type)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Invalid reaction type" });
  }
  try{
  //if the user already reacted
  const [existing] = await dbconnection.query(
    "SELECT * FROM answer_likes WHERE answerid=? AND userid=?",
    [answerId, userId]
  );

  //update existing reaction
  if (existing.length > 0) {
    await dbconnection.query(
      "UPDATE answer_likes SET type=? WHERE answerid=? AND userid=?",
      [type, answerId, userId]
    );
  } else {
    //insert new reaction
    await dbconnection.query(
      "INSERT INTO answer_likes (answerid, userid, type) VALUES (?,?,?)",
      [answerId, userId, type]
    );
  }
    res.json({ message: `Reaction '${type}' recorded for answer ${answerId}` });
  } catch (err) {
    console.error(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "An unexpected error occurred." });
  }
  
}

//get total like/unlike counts
async function getReactions(req, res) {
  try{
  const answerId = req.params.id;

  const [likes] = await dbconnection.query(
      "SELECT COUNT(*) as count FROM answer_likes WHERE answerid=? AND type='like'",
      [answerId]
    );
  const [dislikes] = await dbconnection.query(
      "SELECT COUNT(*) as count FROM answer_likes WHERE answerid=? AND type='dislike'",
      [answerId]
    );
    
    res.json({
      likes: likes[0].count,
      dislikes: dislikes[0].count,
    });
  } catch (err) {
    console.error(err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "An unexpected error occurred." });
  }
};



//add comment to answer
 async function addComment(req, res) {

  try{
  const { comment } = req.body;
  const answerId = req.params.id;
  const userId = req.user.id;


  if (!comment || comment.trim() === "") {
      return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Comment cannot be empty" });
    }

  await dbconnection.query(
    "INSERT INTO answer_comments (answerid, userid, comment) VALUES (?,?,?)",
    [answerId, userId, comment]
  );

  res.json({msg: "Comment added successfully" });
}catch (err) {
    console.error(err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "An unexpected error occurred." });
  }
};


//get comments for answer
 async function getComment(req, res) {

  try{
  const answerId = req.params.id;

  const [comments] = await dbconnection.query(
    `SELECT ac.commentid, ac.comment, ac.created_at,u.username
     FROM answer_comments ac
     JOIN users u ON ac.userid=u.id
     WHERE ac.answerid=?
     ORDER BY ac.created_at ASC`,
    [answerId]
  );

  res.json(comments);
}catch (err) {
    console.error(err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "An unexpected error occurred." });
  }
};




module.exports = { reactAnswer, getReactions , addComment, getComment};