const sql = require("../db");

const bcrypt = require('bcryptjs');
const personnel = function (personnel) {
  this.email = personnel.email;
  this.tel = personnel.tel;
  this.password = personnel.password;
  this.nom = personnel.nom;
  this.prenom = personnel.prenom;
  this.photo = personnel.photo;
  this.CIN=personnel.CIN;
  this.sexe=personnel.sexe;
};


personnel.getAll = (refCentre,result) => {
  sql.query("SELECT * FROM personnel where refCentre=?", refCentre, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    console.log("personnels: ", res);
    result(null, res);
  });
};

  personnel.update = ( CIN, personnel, result) => {

    sql.query(
      "UPDATE personnel SET nom = ?, prenom = ?, email = ?, password = ?, tel= ? , photo=? WHERE CIN = ?",
      
      [personnel.nom, personnel.prenom, personnel.email,personnel.password,personnel.tel,personnel.photo,  CIN],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
        if (res.affectedRows == 0) {
          // Not found Personnel with the  CIN
          result({ kind: "not_found" }, null);
          return;
        }
        console.log("updated personnel: ", {  CIN:  CIN, ...personnel });
        result(null, {  CIN:  CIN, ...personnel });
      }
    );
  };
  
  personnel.delete = ( CIN, result) => {
    sql.query("DELETE FROM personnel WHERE CIN = ?",  CIN, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
      if (res.affectedRows == 0) {
        // Not found Personnel with the  CIN
        result({ kind: "not_found" }, null);
        return;
      }
      console.log("deleted personnel with CIN: ",  CIN);
      result(null, res);
    });
  };
  
personnel.getNbPersonnelsByCentre = (refCentre, result) => {
    sql.query("SELECT count(*) as nb FROM personnel where refCentre= ?", refCentre, (err, res) => {
      if (err) {
        console.error("Error executing query: " + err.stack);
        result(null, err);
        return;
      }
      console.log("Number of personnels: ", res[0].nb);
      result(null, res[0].nb);
    });
  };
  
  personnel.getOnePersonnelByRef = (ref, result) => {
    sql.query("SELECT * FROM personnel where CIN= ?", ref, (err, res) => {
        if (err) {
          console.error("Error executing query: " + err.stack);
          result(null, err);
          return;
        }
        console.log("Result rows:", res);
        result(null,res);
      });
  };

  personnel.search = (value, result) => {
    const query = `SELECT * FROM personnel WHERE CONCAT(nom, prenom, sexe) LIKE '%${value}%'`;
    sql.query(query, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
      console.log("searched personnels: ", res);
      result(null, res);
    });
  };
  personnel.verify = (activeCode, personnel, result) => {
    sql.query(
      "UPDATE personnel SET isActive = ? WHERE activeCode = ?",
      [personnel.isActive, activeCode],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }

        if (res.affectedRows == 0) {
          // not found personnel with the activeCode
          result({ kind: "not_found" }, null);
          return;
        }

        console.log("updated personnel: ", { activeCode: activeCode, ...personnel });
        result(null, { activeCode: activeCode, ...personnel });
      }
    );
  };    
  
  module.exports = personnel;