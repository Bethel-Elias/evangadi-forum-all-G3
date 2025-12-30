const { StatusCodes } = require("http-status-codes");
const dbconnection = require("../db/dbconfig");
const { v4: uuidv4 } = require("uuid");













module.exports = { askQuestion, allQuestions, singleQuestion };