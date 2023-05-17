//
module.exports.getAllDEmandes=(connection,res)=>{
    var sql = "SELECT * FROM demande WHERE etat ="+0;
    connection.query(sql, function (err, rows) {
    if (err) throw err;
    res.json(rows);
  });
}

module.exports.getProp=(connection,id,res)=>{
    var sql = "SELECT * FROM proprietaire WHERE cin ="+id;
    connection.query(sql, function (err, rows) {
    if (err) throw err;
    res.json(rows);
  });
}

module.exports.getDoc=(connection,id,res)=>{
    var sql = "SELECT document FROM demande WHERE reference ="+id;
  connection.query(sql, function (err, results) {
    if (err) throw err;
    const pdfBuffer = results[0].document;
    res.writeHead(200, {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=filename.pdf`,
      'Content-Length': pdfBuffer.length
    });
    res.end(pdfBuffer);
  });
}

module.exports.EnvoyerDemande=(connection,values)=>{
    const sql="INSERT INTO demande (nom, prenom, email, tel, document, date) Values (?,?,?,?,?,?)";
    connection.query(sql,values,(err,result) => {
        if(err){
        console.log("Demande created Failed" ,err)
        return false
        }else {
        console.log("Demande created successfully")
        return true
        }
    });
}

module.exports.UpdateDemande=(connection,id)=>{
    const sql = "UPDATE demande SET etat=? WHERE reference=" + id;
    connection.query(sql, [1], (err, rows) => {
      if (err) {
        console.log("Error executing query: " + err.stack);
        return;
      } else {
        console.log("demande Updated successfully")
      }
    });
}

module.exports.addProp=(connection,values)=>{
    const sql = "INSERT INTO proprietaire (CIN,nom,prenom,tel,email,password,activer,activationCode) VALUES (?, ?, ?, ?,?,?,?,?)";
    connection.query(sql, values, (err, rows) => {
      if (err) {
        console.log("Error executing query: " + err.stack);
        return;
      } else {
        console.log("demande Updated successfully")
      }
    });
}
const { sendConfirmation } = require('../routes/nodemailer');
module.exports.ConfirmationProp=(connection,mail,res)=>{
    const sql = "SELECT * FROM proprietaire WHERE email =?";
    connection.query(sql,[mail], function (err, results) {
        if (err) throw err;
        if(results.length>0){
            var isvalidpass=bcrypt.compareSync(pass,results[0].password)
        if(!isvalidpass){
             res.send({message:false})
        }
        if(results && isvalidpass){
            sendConfirmation(mail,results[0].cin)
            const sql2 = "UPDATE proprietaire SET activer=? WHERE cin=" + results[0].cin;
            connection.query(sql2,[1], function (err, results) {
                if (err) throw err;
                });
             res.send({message:true})
        }
        }
        });
}

module.exports.deleteDemande=(connection,id)=>{
    const sql = "DELETE FROM demande WHERE reference=" + id;
    connection.query(sql, (error, result) => {
        if (error) {
        console.log("Error executing query: " + err.stack);
        return;
        } else {
        console.log("Services Updated successfully")
        }
    });
}