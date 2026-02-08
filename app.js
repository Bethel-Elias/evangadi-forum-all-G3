
const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;

const app = express();
app.use(cors());

//db connection
const dbconnection = require("./db/dbconfig");



//user routes middleware file import
const userRoutes = require("./routes/userRoute");

//question routes middleware file import
const questionRoutes = require("./routes/questionRoute");

//answer routes middleware file import
const answerRoutes = require("./routes/answerRoute");

//like unlike coment middleware file import
const likeUnlikeComentRoutes = require("./routes/likeUnlikeComentRoute");


//json middleware to extract json data
app.use(express.json());



//user routes middleware
app.use("/api/users", userRoutes);

//question routes middleware
app.use("/api/questions", questionRoutes);

//answer routes middleware
app.use("/api", answerRoutes);

//likeunlikeComent middleware
app.use("/api/answers", likeUnlikeComentRoutes);


async function start() {
  try {
    console.log("Attempting to connect to database...");
    const result = await dbconnection.execute("select 'test' ");
    console.log("Database connection test passed:", result[0][0]);
  } catch (dbError) {
    console.error("Database connection failed:", dbError);
    console.warn("Server will start without database connection. Some features may not work.");
  }

  try {
    const server = app.listen(port);
    console.log(`Server is running at http://localhost:${port}`);
    server.on('error', (err) => {
      console.error("Server error:", err);
    });
  } catch (serverError) {
    console.error("Server failed to start:", serverError);
    process.exit(1); // Exit with error code
  }
}
start();
