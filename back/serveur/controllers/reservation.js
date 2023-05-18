
module.exports.getAllReservation=(connection,res)=>{
    var sql = "SELECT * FROM reservation";
  connection.query(sql, function (err, rows) {
    if (err) {
      console.error("Error executing query: " + err.stack);
      return;
    }
    console.log("reserv",rows)
    res.json(rows)
  });
}