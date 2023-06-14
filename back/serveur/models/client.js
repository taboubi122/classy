const sql = require("../db");

const client = function (client) {
  this.email = client.email;
  this.tel = client.tel;
  this.password = client.password;
  this.nom = client.nom;
  this.prenom = client.prenom;
  this.CIN=client.CIN;
  this.activeCode=client.activeCode;
  this.isActive = client.isActive;
};

client.getAll = (result) => {
  sql.query("SELECT * FROM client where isActive=1", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    console.log("clients: ", res);
    result(null, res);
  });
};

client.insert = (newclient, result) => {
  sql.query("INSERT INTO client SET ?", newclient, (err, res) => {
    if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
        }
        console.log("created client: ", { id: res.insertId, ...newclient });
        result(null, { id: res.insertId, ...newclient });
        });
        };
        
        client.delete = (CIN, result) => {
        sql.query("DELETE FROM client WHERE CIN = ?", CIN, (err, res) => {
        if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
        }
        if (res.affectedRows == 0) {
        // Si la requête n'a pas affecté de ligne, cela signifie que le client n'a pas été trouvé
        result({ kind: "not_found" }, null);
        return;
        }
        console.log("deleted client with CIN: ", CIN);
        result(null, res);
        });
        };
        
        client.getInfosClient = (email, result) => {
        sql.query("SELECT * FROM client WHERE email = ?", email, (err, res) => {
        if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
        }
        if (res.length) {
        console.log("found client: ", res[0]);
        result(null, res[0]);
        return;
        }
        // Si le client n'est pas trouvé
        result({ kind: "not_found" }, null);
        });
        };
        client.update = ( email, client, result) => {

          sql.query(
            "UPDATE client SET nom = ?, prenom = ?, tel= ? , photo=? WHERE email = ?",
            
            [client.nom, client.prenom,client.tel,client.photo,email],
            (err, res) => {
              if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
              }
              if (res.affectedRows == 0) {
                // Not found client with the  CIN
                result({ kind: "not_found" }, null);
                return;
              }
              console.log("updated client: ", {  email:  email, ...client });
              result(null, {  email:  email, ...client });
            }
          );
        };       
        client.getByCIN = (CIN, result) => {
          sql.query("SELECT * FROM client WHERE CIN = ?", CIN, (err, res) => {
          if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
          }
          if (res.length) {
          console.log("found client: ", res[0]);
          result(null, res[0]);
          return;
          }
          // Si le client n'est pas trouvé
          result({ kind: "not_found" }, null);
          });
          };
  

        client.update = (activeCode, client, result) => {
          sql.query(
            "UPDATE client SET isActive = ? WHERE activeCode = ?",
            [client.isActive, activeCode],
            (err, res) => {
              if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
              }

              if (res.affectedRows == 0) {
                // not found Client with the activeCode
                result({ kind: "not_found" }, null);
                return;
              }

              console.log("updated client: ", { activeCode: activeCode, ...client });
              result(null, { activeCode: activeCode, ...client });
            }
          );
        };    
        
module.exports = client;