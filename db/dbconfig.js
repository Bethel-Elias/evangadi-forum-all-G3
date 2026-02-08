require("dotenv").config();
const mysql2 = require("mysql2");



const dbconnection = mysql2.createPool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: "localhost",
  database: process.env.DB_DATABASE,
  connectionLimit: 10,
  port: 3306
});

//to check mysql connection to the server

// dbconnection.getConnection((err, result) => {
//   if (err) {
//     console.log(err.message);
//   } else {
//     console.log(result);
//   }
// });

// app.get("/", (req, res) => {
//   res.status(200).send("Evangadi Forum is running");
// });

module.exports = dbconnection.promise();



