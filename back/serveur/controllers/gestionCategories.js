module.exports.getAllCateg=(connection,res)=>{
    var sql = "SELECT * FROM categorie";
    connection.query(sql, function (err, rows) {
    if (err) throw err;
    res.json(rows);
  });
}

module.exports.addCateg=(connection,values)=>{
    const query = "INSERT INTO categorie (nom,description) VALUES (?, ?)";
    connection.query(query, values, (err, rows) => {
        if (err) {
        console.error("Error executing query: " + err.stack);
        return;
        }
    });
}

module.exports.updateCateg=(connection,id,values)=>{
    const sql = "UPDATE categorie SET nom=?, description=? WHERE reference=" + id;
    connection.query(sql, values, (err, rows) => {
      if (err) {
        console.log("Error executing query: " + err.stack);
        return;
      } else {
        console.log("Categorie Updated successfully")
      }
    });
}

module.exports.deleteCateg=(connection,id)=>{
  const sql = "DELETE FROM categorie WHERE reference=" + id;
  const query = connection.query(sql, (error, result) => {
    if (error) {
      res.send({message: "Categorie Deleted Failed"});
    } else {
      res.send({ message: "Categorie Deleted successfully"});
    }
  });
}