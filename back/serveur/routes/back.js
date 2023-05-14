const express = require('express');
const route = express.Router();
const mysql = require("mysql2");
const cors = require("cors");
console.log("hello Classy")
const connection = mysql.createConnection({
  host: "localhost"
  , user: "root"
  , password: ""
  , database: "classynew",
  //port:"3308"
});
connection.connect(err => {
  if (err) {
    console.error("Error connecting to database: " + err.stack);
    return;
  }
  console.log("Connected to database as id " + connection.threadId);
});
route.use(cors({
  origin: "http://localhost:3000"
}));

module.exports = route;