
module.exports.getAllServ=(connection,res)=>{
    var sql = "SELECT * FROM service";
    connection.query(sql, function (err, rows) {
    if (err) throw err;
    res.json(rows);
  });
}

module.exports.addServ=(connection,values,refCentre)=>{
    const query = "INSERT INTO service (nomService,description,prix,duree,refCateg) VALUES (?, ?, ?, ?, ?, ?)";
    connection.query(query, values, (err, rows) => {
        if (err) {
        console.log("Error executing query: " + err);
        return;
        } else {
          const sql2= "SELECT max(referense) as ref from service"
          connection.query(sql2, (err, rows) => {
            if (err) {
              console.log("Error executing query: " + err.stack);
              return;
            } else {
              const ref=rows[0].ref
              const sql3 = "INSERT INTO servicecentre SET refCentre=?, refService=? "
              connection.query(sql3, [ref,refCentre], (err, rows) => {
                if (err) {
                console.log("Error executing query: " + err);
                return;
                } else {
                  console.log("donne!!!")
                }})
  
            }
          })
        }
    });
}

module.exports.updateServ=(connection,values,id)=>{
    const sql = "UPDATE service SET nomService=?, description=?, prix=?, duree=?, refCateg=? WHERE reference=" + id;
    connection.query(sql, values, (err, rows) => {
      if (err) {
        console.log("Error executing query: " + err.stack);
        return;
      } else {
        console.log("done!!!")
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