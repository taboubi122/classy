
module.exports.getAllCentres=(connection,res)=>{
    var sql = "SELECT * FROM centre";
  connection.query(sql, function (err, rows) {
    if (err) {
      console.error("Error executing query: " + err.stack);
      return;
    }
    res.json(rows)
  });
}