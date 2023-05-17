const express = require('express');
const route = express.Router();
const mysql = require("mysql2");
const cors = require("cors");
const { getAllDEmandes, getDoc, UpdateDemande, addProp, ConfirmationProp, deleteDemande, EnvoyerDemande, getProp } = require('../controllers/gestionDemandes');
console.log("hello Classy")
const connection = mysql.createConnection({
  host: "localhost"
  , user: "root"
  , password: ""
  , database: "classynew",
  //port:"3308"
});
connection.connect(err => {
  if (err) {
    console.error("Error connecting to database: " + err.stack);
    return;
  }
  console.log("Connected to database as id " + connection.threadId);
});
route.use(cors({
  origin: "http://localhost:3000"
}));
//*************************************** DEMANDE ******************************/
//get All Demandes
route.get("/api/getAllDemandes", (req, res) => {
  getAllDEmandes(connection,res)
});
//get Prop
route.get("/api/getProp/:reference", (req, res) => {
  id=req.params.reference;
  getProp(connection,id,res)
});
//get Document PDF
route.get("/api/getDoc/:reference", (req, res) => {
  id=req.params.reference;
  getDoc(connection,id,res)
});
//Envoyer Demande
const multer = require('multer');
const storage = multer.memoryStorage();
const upload2 = multer({ storage: storage }); 
route.use("uploads", express.static("uploads"))
route.post('/api/enyoyerDemande', upload2.single('fichier'), async (req,res) =>{
  const file=req.file.buffer;
  const values = [req.body.nom,req.body.prenom,req.body.mail,req.body.tel,file,new Date()];
  EnvoyerDemande(connection,values)
});
//Approuver Demande
const bcrypt = require('bcrypt');
const { sendConfirmationEmail } = require('./nodemailer');
const { getAllCateg, addCateg, updateCateg, deleteCateg } = require('../controllers/gestionCategories');
const { getAllServ, addServ, updateServ, deleteServ, getServById, addServProp, updateServProp } = require('../controllers/gestionServices');
const { getAllCentres } = require('../controllers/gestionCentres');
const { getAllOffres, addOffre, updateOffre, deleteOffre, addOffreProp, updateOffreProp } = require('../controllers/gestionOffre');
const { getAllHoraire, getAllJour, addHoraire, updateHoraire } = require('../controllers/gestionHoraire');
route.post('/api/ApprouverDemande/:reference',(req,res) =>{
  const  id = req.params.reference;
  const { nom, prenom, tel, mail } = req.body;
  const characters = "0123456789azertyuiopqsdfghjklmwxcvbnAZERTYUIOPQSDFGHJKLMWXCVBN.-+*/$="
  let mdp = "";
  for (let i = 0; i < 28; i++) {
    mdp += characters[Math.floor(Math.random() * characters.length)];
  }
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const lastMdp = bcrypt.hashSync(mdp, salt);
  const values = [id,nom, prenom,tel, mail,lastMdp,0,mdp];
  sendConfirmationEmail(mail, mdp);
  UpdateDemande(connection,id)
  addProp(connection,values)
});
// Confirmer Demande
route.post('/api/ConfirmerDemande',(req,res) =>{
  const { mail, pass } = req.body;
  ConfirmationProp(connection,mail,res)
});
//Desapprouver Demande
route.delete("/api/DesapprouverDemande/:reference", (req, res) => {
  const id=req.params.reference;
  deleteDemande(connection,id);
});
//********************************** CATEGORIES ****************************************/
//get All Categories
route.get("/api/getAllCategories", (req, categ) => {
  getAllCateg(connection,categ)
});
//add Categorie
route.post("/api/addCategories", (req, res) => {
  const { nom, description} = req.body;
  const values = [ nom, description];
  addCateg(connection,values);
});
//  Update Categories
route.put("/api/UpdateCategories/:reference", (req, res) => {
  const id = req.params.reference;
  const { nomupdate, descriptionUpdate} = req.body;
  n = ""
  d = ""
  const sql = "SELECT * FROM categorie WHERE reference=" + id;
  connection.query(sql, function (err, rows) {
    if (err) {
      console.error("Error executing query: " + err.stack);
      return;
    }
    if (nomupdate.length == 0) {
      n = rows[0].nom
    } else {
      n = nomupdate
    }
    if (descriptionUpdate.length === 0) {
      d = rows[0].description
    } else {
      d = descriptionUpdate
    }
    const values = [n, d];
    updateCateg(connection,id,values)
  });
});
//  Delete Categorie
route.delete("/api/deleteCategories/:reference", (req, res) => {
  const id=req.params.reference;
  deleteCateg(connection,id)
});
//********************************** SERVICES ****************************************/
const moment = require('moment');
// get All Services
route.get("/api/getAllServices", (req, res) => {
  getAllServ(connection,res)
});
// get All Centres
route.get("/api/getCentres", (req, res) => {
  getAllCentres(connection,res)
});
// add Service
route.post("/api/addService",(req, res) => {
  const { nom, description, prix, duree, refselectedCentre, refselectedCateg } = req.body;
  const time = moment(duree, 'HH:mm').toDate();
  const values = [nom, description, prix, time, refselectedCentre, refselectedCateg];
  addServ(connection,values)
});
// Update Service
route.put("/api/UpdateServices/:reference", (req, res) => {
  const id = req.params.reference;
  const {nomUpdate, descriptionUpdate, prixUpdate, dureeUpdate, refselectedCentre, refselectedCateg} = req.body;
  n = "";
  d = "";
  p = 0
  du = null
  refctr = null;
  refc = null;
  var sql = "SELECT * FROM service WHERE reference=" + id;
  connection.query(sql, function (err, rows) {
    if (err) {
      console.error("Error executing query: " + err.stack);
      return;
    }
    if (nomUpdate.length == 0) {
      n = rows[0].nom
    } else {
      n = nomUpdate
    }
    if (descriptionUpdate.length === 0) {
      d = rows[0].description
    } else {
      d = descriptionUpdate
    }
    if (prixUpdate == 0) {
      p = rows[0].prix
    } else {
      p = prixUpdate
    }
    if (dureeUpdate.length === 0) {
      du = rows[0].duree
    } else {
      du = dureeUpdate
    }
    if (refselectedCentre.length === 0) {
      refctr = rows[0].refCentre
    } else {
      refctr = refselectedCentre
    }
    if (refselectedCateg.length === 0) {
      refc = rows[0].refCateg
    } else {
      refc = refselectedCateg
    }
    const time = moment(du, 'HH:mm').toDate();
    const values = [ n, d, p, time, refctr, refc];
    updateServ(connection,values,id);
  });
});
// Delete Service
route.delete("/api/deleteServices/:reference", (req, res) => {
  const id=req.params.reference;
  deleteServ(connection,id)
});
// get Services By ID
route.get("/api/getAllServicesProp/:reference", (req, res) => {
  const id =req.params.reference;
  getServById(connection,id,res)
});
// add Service Prop
route.post("/api/addServiceProp", (req, res) => {
  const { nom, description, prix, duree, idProp, refselectedCateg} = req.body;
  const values = [nom, description, prix, duree, idProp, refselectedCateg];
  addServProp(connection,values)
});
// Update Service Prop
route.put("/api/UpdateServicesProp/:reference", (req, res) => {
  const id = req.params.reference;
  const { nomUpdate, descriptionUpdate, prixUpdate, dureeUpdate, idProp, refselectedCateg } = req.body;
  n = "";
  d = "";
  p = 0;
  du = null;
  refc = null;
  const sql = "SELECT * FROM service WHERE reference=" + id;
  connection.query(sql, function (err, rows) {
    if (err) {
      console.error("Error executing query: " + err.stack);
      return;
    }
    if (nomUpdate.length == 0) {
      n = rows[0].nom
    } else {
      n = nomUpdate
    }
    if (descriptionUpdate.length === 0) {
      d = rows[0].description
    } else {
      d = descriptionUpdate
    }
    if (prixUpdate == 0) {
      p = rows[0].prix
    } else {
      p = prixUpdate
    }
    if (dureeUpdate.length === 0) {
      du = rows[0].duree
    } else {
      du = dureeUpdate
    }
    if (refselectedCateg.length === 0) {
      refc = rows[0].refCateg
    } else {
      refc = refselectedCateg
    }
    const values = [n, d, p, du, idProp, refc];
    updateServProp(connection,values,id)
  });
});
//********************************** OFFRES ****************************************/
// get All Offres
route.get("/api/getAllOffres", (req, res) => {
  getAllOffres(connection,res)
});
// add Offres
route.post("/api/addOffres", (req, res) => {
  const { nom, description, pourcentage, dateDebut, dateFin, refselectedService } = req.body;
  const values = [nom, description, pourcentage, dateDebut, dateFin, refselectedService];
  addOffre(connection,values)
});
// Update Offres
route.put("/api/UpdateOffres/:reference", (req, res) => {
  const id = req.params.reference;
  const { nomUpdate, descriptionUpdate, pourcentageUpdate, ddUpdate, dfUpdate, refselectedService } = req.body;
  n = "";
  d = "";
  pr = 0
  dd = null
  df = null;
  refs = null;
  const sql = "SELECT * FROM offre WHERE reference=" + id;
  connection.query(sql, function (err, rows) {
    if (err) {
      console.error("Error executing query: " + err.stack);
      return;
    }
    if (nomUpdate.length == 0) {
      n = rows[0].nom
    } else {
      n = nomUpdate
    }
    if (descriptionUpdate.length === 0) {
      d = rows[0].description
    } else {
      d = descriptionUpdate
    }
    if (pourcentageUpdate == 0) {
      pr = rows[0].pourcentage
    } else {
      pr = pourcentageUpdate
    }
    if (ddUpdate.length === 0) {
      dd = rows[0].dateDebut
    } else {
      dd = ddUpdate
    }
    if (dfUpdate.length === 0) {
      df = rows[0].dateFin
    } else {
      df = dfUpdate
    }
    if (refselectedService.length === 0) {
      refs = rows[0].refService
    } else {
      refs = refselectedService
    }
    const values = [n, d, pr, dd, df, refs];
    updateOffre(connection,values)
  });
});
// delete Offre
route.delete("/api/deleteOffres/:reference", (req, res) => {
  const id=req.params.reference;
  deleteOffre(connection,id)
});
//  get offres By ID
route.get("/api/getAllOffresByID/:reference", (req, res) => {
  var sql = "SELECT s.* FROM service s INNER JOIN offre o ON s.reference = o.refService WHERE s.refCentre = " + req.params.reference;
  connection.query(sql, function (err, rows) {
    if (err) {
      console.error("Error executing query: " + err.stack);
      return;
    }
    var tabserv = []
    var eleserv = 0
    for (let i = 0; i < rows.length; i++) {
      tabserv[eleserv] = rows[i].reference
      eleserv++
    }
    let r = Array.from(new Set(tabserv));
    console.log(r);
    var offre = [];
    var queryCount = 0;
    for (let j = 0; j < r.length; j++) {
      var sql2 = "SELECT * FROM offre WHERE refService =" + r[j];
      connection.query(sql2, function (err, row) {
        if (err) {
          console.error("Error executing query: " + err.stack);
          return;
        }
        if (row.length > 1) {
          for (let x = 0; x < row.length; x++) {
            offre[queryCount] = row[x];
            queryCount++;
          }
        } else {
          offre[queryCount] = row[0];
          queryCount++;
        }
        if (queryCount === rows.length) {
          console.log(offre);
          res.json(offre);
        }
      });
    }
  });
});

// add OFFRES
route.post("/api/addOffres", (req, res) => {
  const { nom, description, pourcentage, dateDebut, dateFin, refselectedService } = req.body;
  const values = [nom, description, pourcentage, dateDebut, dateFin, refselectedService];
  addOffreProp(connection,values)
});
//  Update OFFRES
route.put("/api/UpdateOffres/:reference", (req, res) => {
  const id = req.params.reference;
  const {nomUpdate, descriptionUpdate, pourcentageUpdate, ddUpdate, dfUpdate, refselectedService } = req.body;
  n = "";
  d = "";
  pr = 0
  dd = null
  df = null;
  refs = null;
  var sql = "SELECT * FROM offre WHERE reference=" + id;
  connection.query(sql, function (err, rows) {
    if (err) {
      console.error("Error executing query: " + err.stack);
      return;
    }
    if (nomUpdate.length == 0) {
      n = rows[0].nom
    } else {
      n = nomUpdate
    }
    if (descriptionUpdate.length === 0) {
      d = rows[0].description
    } else {
      d = descriptionUpdate
    }
    if (pourcentageUpdate == 0) {
      pr = rows[0].pourcentage
    } else {
      pr = pourcentageUpdate
    }
    if (ddUpdate.length === 0) {
      dd = rows[0].dateDebut
    } else {
      dd = ddUpdate
    }
    if (dfUpdate.length === 0) {
      df = rows[0].dateFin
    } else {
      df = dfUpdate
    }
    if (refselectedService.length === 0) {
      refs = rows[0].refService
    } else {
      refs = refselectedService
    }
    const values = [n, d, pr, dd, df, refs];
    updateOffreProp(connection,id,values)
  });
});
//********************************** OFFRES ****************************************/
// get All Jour
route.get("/api/getAllJour", (req, res) => {
  getAllJour(connection,res)
});
//  get All Horaire
route.get("/api/getAllHoraires/:reference", (req, res) => {
  const id=req.params.reference;
  getAllHoraire(connection,id,res)
});
// add Horaire
route.post("/api/addHoraires", (req, res) => {
  const {  ouverture, fermeture, refselectedJour, idProp } = req.body;
  const values = [ouverture, fermeture, refselectedJour, idProp];
  addHoraire(connection,values)
});
// Update Horaire
route.put("/api/UpdateHoraire/:reference", (req, res) => {
  const id = req.params.reference;
  const { ouvertureUpdate, fermetureUpdate, refselectedJourUpdate, idProp } = req.body;
  ov = "";
  f = "";
  refH = 0
  idCtr = null
  var sql = "SELECT * FROM heure WHERE reference=" + id;
  connection.query(sql, function (err, rows) {
    if (err) {
      console.error("Error executing query: " + err.stack);
      return;
    }
    if (ouvertureUpdate.length == 0) {
      ov = rows[0].ouverture
    } else {
      ov = ouvertureUpdate
    }
    if (fermetureUpdate.length === 0) {
      f = rows[0].fermeture
    } else {
      f = fermetureUpdate
    }
    if (refselectedJourUpdate.length === 0) {
      refH = rows[0].refHoraire
    } else {
      refH = refselectedJourUpdate
    }
    if (idProp.length === 0) {
      idCtr = rows[0].refCentre
    } else {
      idCtr = idProp
    }
    const values = [ov, f, refH, idCtr];
    updateHoraire(connection,id,values)
  });
});
module.exports = route;