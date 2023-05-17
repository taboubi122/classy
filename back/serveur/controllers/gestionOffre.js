
module.exports.getAllOffres=(connection,res)=>{
    const sql = "SELECT * FROM offre";
    connection.query(sql, function (err, rows) {
    if (err) {
      console.error("Error executing query: " + err.stack);
      return;
    }
    console.log("Result rows:", rows);
    res.json(rows);
  });
}

module.exports.addOffre=(connection,values)=>{
    const query = "INSERT INTO offre (nom,description,pourcentage,dateDebut,dateFin,refService) VALUES (?, ?, ?, ?, ?, ?)";
    connection.query(query, values, (err, rows) => {
      if (err) {
        console.log("Error executing query: " + err.stack);
        return;
      } else {
        console.log("Services Created successfully")
      }
    });
}

module.exports.updateOffre=(connection,values)=>{
    const sql = "UPDATE offre SET nom=?, description=?, pourcentage=?, dateDebut=?, dateFin=?, refService=? WHERE reference=" + id;
    connection.query(sql, values, (err, rows) => {
      if (err) {
        console.log("Error executing query: " + err.stack);
        return;
      } else {
        console.log("Categorie Updated successfully")
      }
    });
}

module.exports.deleteOffre=(connection,id)=>{
    const sql = "DELETE FROM offre WHERE reference=" + id
    const query = connection.query(sql, (error, result) => {
    if (error) {
      console.log("Error executing query: " + err.stack);
      return;
    } else {
      console.log("Services Updated successfully")
    }
  });
}

module.exports.addOffreProp=(connection,values)=>{
    const query = "INSERT INTO offre (nom,description,pourcentage,dateDebut,dateFin,refService) VALUES (?, ?, ?, ?, ?, ?)";
    connection.query(query, values, (err, rows) => {
    if (err) {
      console.log("Error executing query: " + err.stack);
      return;
    } else {
      console.log("Services Created successfully")
    }
  });
}

module.exports.updateOffreProp=(connection,id,values)=>{
    let sql = "UPDATE offre SET nom=?, description=?, pourcentage=?, dateDebut=?, dateFin=?, refService=? WHERE reference=" + id;
    connection.query(sql, values, (err, rows) => {
      if (err) {
        console.log("Error executing query: " + err.stack);
        return;
      } else {
        console.log("Categorie Updated successfully")
      }
    });
}