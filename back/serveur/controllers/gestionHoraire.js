
module.exports.getAllJour=(connection,res)=>{
    const sql = "SELECT * FROM horaire";
    connection.query(sql, function (err, rows) {
    if (err) {
      console.error("Error executing query: " + err.stack);
      return;
    }
    res.json(rows);
  });
}

module.exports.getAllHoraire=(connection,id,res)=>{
    const sql = "SELECT * FROM heure WHERE refCentre =" + id;
    connection.query(sql, function (err, rows) {
    if (err) {
      console.error("Error executing query: " + err.stack);
      return;
    }
    res.json(rows);
  });
}

module.exports.addHoraire=(connection,values)=>{
    const query = "INSERT INTO heure (ouverture,fermeture,refHoraire,refCentre) VALUES (?, ?, ?, ?, ?)";
    connection.query(query, values, (err, rows) => {
    if (err) {
      console.log("Error executing query: " + err.stack);
      return;
    } else {
      console.log("Horaire Created successfully")
    }
  });
}

module.exports.updateHoraire=(connection,id,values)=>{
    const sql = "UPDATE heure SET ouverture=?, fermeture=?, refHoraire=?, refCentre=? WHERE reference=" + id;
    connection.query(sql, values, (err, rows) => {
      if (err) {
        console.log("Error executing query: " + err.stack);
        return;
      } else {
        console.log("Categorie Updated successfully")
      }
    });
}