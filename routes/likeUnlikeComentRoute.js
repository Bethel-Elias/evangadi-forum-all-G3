const express = require("express");
const router = express.Router();

const { reactAnswer, getReactions,addComment,getComment } = require("../controller/likeUnlikeComentcontroller");

const authMiddleware = require("../middleware/authMiddleware");

// post like/unlike answer
router.post("/:id/reactions", authMiddleware, reactAnswer)

//get like/unlike counts
router.get("/:id/reactions", getReactions)

//add comment
router.post("/:id/comments", authMiddleware, addComment)

//get comment
router.get("/:id/comments", getComment)

module.exports = router;