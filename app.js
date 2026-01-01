
const express = require("express");
const cors = require("cors");
<<<<<<< HEAD
const port = 5500;
=======
const port = 6000;
>>>>>>> myfork/main

const app = express();
app.use(cors());

//db connection
const dbconnection = require("./db/dbconfig");

<<<<<<< HEAD
// / Import custom middleware
const logger = require("./middleware/loggingMiddleware");
const errorHandler = require("./middleware/errorHandler");

// Use logging middleware for all requests
app.use(logger);
=======

>>>>>>> myfork/main

//user routes middleware file import
const userRoutes = require("./routes/userRoute");

//question routes middleware file import
const questionRoutes = require("./routes/questionRoute");

//answer routes middleware file import
const answerRoutes = require("./routes/answerRoute");




//json middleware to extract json data
app.use(express.json());



//user routes middleware
app.use("/api/users", userRoutes);

//question routes middleware
app.use("/api/questions",  questionRoutes);

//answer routes middleware
app.use("/api/answers",  answerRoutes);



async function start() {
  try {
    const result = await dbconnection.execute("select 'test' ");
    // console.log(result)
    await app.listen(port);
    console.log("database connection established");
    console.log(`server is running at ${port}`);
  } catch (error) {
    console.log(error.message);
  }
}
start();
