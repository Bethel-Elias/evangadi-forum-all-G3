const express = require("express");
const router = express.Router();

const { reactAnswer, getReactions,addComment,getComment } = require("../controller/likeUnlikeComentcontroller");

const authMiddleware = require("../middleware/authMiddleware");

// post like/unlike answer
router.post("/answers/:id/reactions", authMiddleware, reactAnswer)

//get like/unlike counts
router.get("/answers/:id/reactions", getReactions)

//add comment
router.post("/answers/:id/comments", authMiddleware, addComment)

//get comment
router.get("/answers/:id/comments", getComment)

module.exports = router;