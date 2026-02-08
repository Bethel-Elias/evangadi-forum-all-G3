const express = require("express");
const router = express.Router();

//import authentication middleware
const authMiddleware = require("../middleware/authMiddleware")

//user controllers
const {register,login,checkUser} = require("../controller/userController")

//register route
router.post("/register", register)


//login routes
router.post("/login", login);

//check users
router.get("/check", authMiddleware,checkUser);


module.exports = router