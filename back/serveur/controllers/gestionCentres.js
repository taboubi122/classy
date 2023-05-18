
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

module.exports.getAllVille=(connection,res)=>{
  var sql = "SELECT * FROM ville";
connection.query(sql, function (err, rows) {
  if (err) {
    console.error("Error executing query: " + err.stack);
    return;
  }
  console.log("ville",rows)
  res.json(rows)
});
}

module.exports.getAllVilleC=(connection,res)=>{
  var sql = "SELECT * FROM localisation ";
connection.query(sql, function (err, rows) {
  if (err) {
    console.error("Error executing query: " + err.stack);
    return;
  }
  console.log("localisation: ",rows)
  res.json(rows)
});
}