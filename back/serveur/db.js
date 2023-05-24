const mysql = require("mysql2");
  const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "classynew",
    //port:"3308"
  });

connection.connect((err) => {
  if (err) {
    console.error("error connecting to database: " + err.stack);
    return;
  }
  console.log("connected to database with id " + connection.threadId);
});

module.exports = connection;
