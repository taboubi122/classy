module.exports.getAllAvis=(connection,res)=>{
    var sql = "SELECT * FROM avis";
  connection.query(sql, function (err, rows) {
    if (err) {
      console.error("Error executing query: " + err.stack);
      return;
    }
    console.log("ville",rows)
    res.json(rows)
  });
  }