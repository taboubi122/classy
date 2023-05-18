
module.exports.getAllClients=(connection,res)=>{
    var sql = "SELECT * FROM client";
  connection.query(sql, function (err, rows) {
    if (err) {
      console.error("Error executing query: " + err.stack);
      return;
    }
    console.log("Clients: ",rows)
    res.json(rows)
  });
}