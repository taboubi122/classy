
module.exports.getAllServ=(connection,res)=>{
    var sql = "SELECT * FROM service";
    connection.query(sql, function (err, rows) {
    if (err) throw err;
    res.json(rows);
  });
}

module.exports.addServ=(connection,values)=>{
    const query = "INSERT INTO service (nom,description,prix,duree,refCentre,refCateg) VALUES (?, ?, ?, ?, ?, ?)";
    connection.query(query, values, (err, rows) => {
        if (err) {
        console.log("Error executing query: " + err);
        return;
        } else {
        console.log("Services Created successfully")
        }
    });
}

module.exports.updateServ=(connection,values,id)=>{
    const sql = "UPDATE service SET nom=?, description=?, prix=?, duree=?, refCentre=?, refCateg=? WHERE reference=" + id;
    connection.query(sql, values, (err, rows) => {
      if (err) {
        console.log("Error executing query: " + err.stack);
        return;
      } else {
        console.log("Categorie Updated successfully")
      }
    });
}

module.exports.deleteServ=(connection,id)=>{
    const sql = "DELETE FROM service WHERE reference=" + id;
    const query = connection.query(sql, (error, result) => {
    if (error) {
        console.log("Error executing query: " + err.stack);
    return;
    } else {
        console.log("Services Updated successfully")
    }
    });
}

module.exports.getServById=(connection,id,res)=>{
  const query = "SELECT s.* FROM service s JOIN servicecentre sc ON s.reference = sc.refService WHERE sc.refCentre ="+id;

    connection.query(query, function (err, rows) {
    if (err) {
      console.error("Error executing query: " + err.stack);
      return;
    }
    console.log(rows)
    res.json(rows);
  });
}
module.exports.addServProp=(connection,values)=>{
    const query = "INSERT INTO service (nom,description,prix,duree,refCentre,refCateg) VALUES (?, ?, ?, ?, ?, ?)";
    connection.query(query, values, (err, rows) => {
    if (err) {
      console.log("Error executing query: " + err.stack);
      return;
    } else {
      console.log("Services Created successfully")
    }
  });
}

module.exports.updateServProp=(connection,values,id)=>{
    const sql = "UPDATE service SET nom=?, description=?, prix=?, duree=?, refCentre=?, refCateg=? WHERE reference=" + id;
    connection.query(sql, values, (err, rows) => {
      if (err) {
        console.log("Error executing query: " + err.stack);
        return;
      } else {
        console.log("Categorie Updated successfully")
      }
    });
}

module.exports.getServiceMobile=(connection,values)=>{
  var sql = "SELECT * FROM service INNER JOIN servicecentre ON servicecentre.refService = service.reference where refCateg=? and servicecentre.refCentre=?";
  connection.query(sql, values, (err, rows) => {
    if (err) {
      console.log("Error executing query: " + err.stack);
      return;
    } else {
      console.log("getService")
    }
  });
}
