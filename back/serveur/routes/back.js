const express=require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload2 = multer({ storage: storage }); 
const route = express.Router();
const cors = require("cors");
const bcrypt2 = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { format, startOfWeek, addDays, addMinutes  } = require('date-fns');
const { fr } = require('date-fns/locale')
const clientController = require("../controllers/clientController");
const personnelController = require("../controllers/personnelController");
const { sendConfirmationEmail } = require('../confirmerEmail');
const { sendConfirmationEmail2, sendMAilClient } = require('./nodemailer');
const { getAllCateg, addCateg, updateCateg, deleteCateg } = require('../controllers/gestionCategories');
const { getAllServ, addServ, updateServ, deleteServ, getServById, addServProp, updateServProp } = require('../controllers/gestionServices');
const { getAllCentres, getAllVille, getAllVilleC } = require('../controllers/gestionCentres');
const { getAllOffres, addOffre, updateOffre, deleteOffre, addOffreProp, updateOffreProp } = require('../controllers/gestionOffre');
const { getAllHoraire, getAllJour, addHoraire, updateHoraire } = require('../controllers/gestionHoraire');
const { getAllDEmandes, getDoc, UpdateDemande, addProp, ConfirmationProp, deleteDemande, EnvoyerDemande, getProp } = require('../controllers/gestionDemandes');
route.use("uploads", express.static("uploads"))
const connection = require("../db");

route.use(cors({ origin: "http://localhost:3000" }));
//*************************************** DEMANDE ******************************/
route.post('/sendNotification', async (req, res) => {
  const { playerIds, title, message } = req.body;

  try {
    await pushNotifController.sendNotification(playerIds, title, message);
    res.status(200).json({ message: 'Notification sent successfully' });
  } catch (error) {
    console.error('Failed to send notification:', error);
    res.status(500).json({ message: 'Failed to send notification' });
  }
});
//get All Demandes
route.get("/api/getAllDemandes", (req, res) => {
  getAllDEmandes(connection,res)
});
//get All Reservation
route.get("/api/getAllReservation", (req, res) => {
  getAllReservation(connection,res)
});
//get All Ville
route.get("/api/getAllVille", (req, res) => {
  getAllVille(connection,res)
});

//get All Centre By Ville
route.get("/api/getAllVilleC", (req, res) => {
  getAllVilleC(connection,res)
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
route.post('/api/enyoyerDemande', upload2.single('fichier'), async (req,res) =>{
  const file=req.file.buffer;
  const values = [req.body.nom,req.body.prenom,req.body.mail,req.body.tel,file,new Date()];
  EnvoyerDemande(connection,values)
});
//Approuver Demande

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
route.get("/api/servicesProp/:CIN",(req,res)=>{
  const id = req.params.CIN;
  const query =  "SELECT service.* FROM service INNER JOIN servicecentre ON service.reference = servicecentre.refService INNER JOIN centre ON servicecentre.refCentre = centre.reference WHERE centre.CINProp="+id;
  connection.query(query,(err, rows) => {
    if (err) {
      console.error("Error executing query: " + err.stack);
      return;
    }
    console.log("Result rows:", rows);
    res.json( rows);
  });
})
route.get("/api/reservationProp/:CIN",(req,res)=>{
  const id = req.params.CIN;
  const query =  "SELECT reservation.* FROM reservation INNER JOIN centre ON reservation.refCentre = centre.reference WHERE centre.CINProp ="+id;
  connection.query(query,(err, rows) => {
    if (err) {
      console.error("Error executing query: " + err.stack);
      return;
    }
    console.log("Result rows:", rows);
    res.json( rows);
  });
})
route.get("/api/avisProp/:CIN",(req,res)=>{
  const id = req.params.CIN;
  const query =  "SELECT * FROM avis WHERE refCentre IN ( SELECT reference FROM centre WHERE CinProp = ?)";
  connection.query(query,id,(err, rows) => {
    if (err) {
      console.error("Error executing query: " + err.stack);
      return;
    }
    console.log("Result rows avis:", rows);
    res.json( rows);
  });
})
//********************************** SERVICES ****************************************/
const moment = require('moment');
const { getAllReservation } = require('../controllers/reservation');
const { getAllAvis } = require('../controllers/gestionAvis');
// get All Services
route.get("/api/getAllServices", (req, res) => {
  getAllServ(connection,res)
});
// get All Avis
route.get("/api/getAllAvis", (req, res) => {
  getAllAvis(connection,res)
});
// get Admin
route.get("/api/LoginAdmin", (req, res) => {
  var sql = "SELECT * FROM admin";
  connection.query(sql, function (err, rows) {
    if (err) {
      console.error("Error executing query: " + err.stack);
      return;
    }
    res.json(rows)
  });
});
// get Prop
route.get("/api/LoginProp", (req, res) => {
  var sql = "SELECT * FROM proprietaire";
  connection.query(sql, function (err, rows) {
    if (err) {
      console.error("Error executing query: " + err.stack);
      return;
    }
    console.log(rows)
    res.json(rows)
  });
});
route.get("/api/getCentresPtop/:CIN",(req,res)=>{
  const id = req.params.CIN;
  const query =  "SELECT * FROM centre WHERE CINProp="+id;
  connection.query(query,(err, rows) => {
    if (err) {
      console.error("Error executing query: " + err.stack);
      return;
    }
    console.log("Result rows:", rows);
    res.json( rows);
  });
})
route.get("/api/personnelProp/:CIN",(req,res)=>{
  const id = req.params.CIN;
  const query =  "SELECT personnel.* FROM personnel INNER JOIN centre ON personnel.refCentre = centre.reference WHERE centre.CINProp ="+id;
  connection.query(query,(err, rows) => {
    if (err) {
      console.error("Error executing query: " + err.stack);
      return;
    }
    console.log("Result rows:", rows);
    res.json( rows);
  });
})
route.get("/api/getClient",(req,res)=>{
  const query =  "SELECT * FROM client";
  connection.query(query,(err, rows) => {
    if (err) {
      console.error("Error executing query: " + err.stack);
      return;
    }
    console.log("Result rows:", rows);
    res.json( rows);
  });
})
route.get("/api/getResvP/:CIN",(req,res)=>{
  const id = req.params.CIN;
  const query =  "SELECT * FROM reservation WHERE etat=? and CINPersonnel=?";
  connection.query(query,["0",id],(err, rows) => {
    if (err) {
      console.error("Error executing query: " + err.stack);
      return;
    }
    console.log("Result rows:", rows);
    res.json( rows);
  });
})
route.get("/api/LoginPerso", (req, res) => {
  var sql = "SELECT * FROM personnel";
  connection.query(sql, function (err, rows) {
    if (err) {
      console.error("Error executing query: " + err.stack);
      return;
    }
    console.log(rows)
    res.json(rows)
  });
});
// get All Clients
route.get("/api/getAllClients", (req, res) => {
  getAllClients(connection,res)
});
route.get("/api/getclientav", (req, res) => {
  var sql = "SELECT * FROM client";
  connection.query(sql, function (err, rows) {
    if (err) {
      console.error("Error executing query: " + err.stack);
      return;
    }
    res.json(rows)
  });
});
// get All Centres
route.get("/api/getCentres", (req, res) => {
  getAllCentres(connection,res)
});
// add Service
route.post("/api/addService",(req, res) => {
  const { nom, description, prix, duree, refselectedCentre, refselectedCateg } = req.body;
  const time = moment(duree, 'HH:mm').toDate();
  const values = [nom, description, prix, time, refselectedCateg];
  addServ(connection,values,refselectedCentre)
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
  var sql = "SELECT offre.* FROM offre INNER JOIN servicecentre ON offre.refService = servicecentre.refService WHERE servicecentre.refCentre =" + req.params.reference;
  connection.query(sql, function (err, rows) {
    if (err) {
      console.error("Error executing query: " + err.stack);
      return;
    }
    res.json(rows);
})
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
route.post("/api/confirmerPresence/:client/:centre/:ref", (req, res) => {
  const clt=req.params.client;
  const r=req.params.ref;
  const ctr=req.params.centre;
  const query = "INSERT INTO avis (refCentre,CinClient) VALUES (?, ?)";
    connection.query(query, [ctr,clt], (err, rows) => {
        if (err) {
        console.log("Error executing query: " + err);
        return;
        } else {
          const query = "SELECT c.nom AS nomClient, c.email AS emailClient, c.prenom AS prenomClient, ce.nom AS nomCentre FROM client c INNER JOIN reservation r ON c.CIN = r.CINClient INNER JOIN centre ce ON r.refCentre = ce.reference WHERE c.CIN = ? AND ce.reference = ?";
          connection.query(query,[clt,ctr], (err, rows) => {
            if (err) {
              console.error("Error executing query: " + err.stack);
              return;
            }
            console.log("Result rows:", rows);
            sendMAilClient(clt,ctr,r,rows[0].emailClient)
                })
        }
    });
});
route.put("/api/updateResv/:reference",(req,res) => {
  let sql = "UPDATE reservation SET etat=? WHERE reference=" +
      req.params.reference;
  let query = connection.query(sql,[1], (error,result) => {
      if(error){
          res.send({ status: false, message: "Categorie Deleted Failed"});
      } else {
          res.send({ status: true, message: "Categorie Deleted successfully"}); 
      }
  });
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


  
//*********************************Authentification****************************************/


route.post('/api/signIn', (req, res) => {
  const { email, password } = req.body;
  
  connection.query("SELECT email,type,password FROM ( SELECT email,type,password FROM centre UNION ALL SELECT email,type,password FROM personnel where isActive=1 UNION ALL SELECT email,type,password FROM client where isActive=1 ) AS users WHERE email= ?", [email], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send('Internal server error');
    } else if (results.length === 0) {
      res.status(401).send('Incorrect email or password');
    } else {
      const user = results[0];
      console.log('User type:', user.type);
      bcrypt2.compare(password, user.password, (error, isMatch) => {
        if (error) {
          console.error(error);
          res.status(500).send('Internal server error');
        } else if (!isMatch) {
          res.status(401).send('Incorrect email or password');
        } else {
          
          const token = jwt.sign({ id: user.id, type: user.type }, 'your_secret_key', { expiresIn: '1h' });
          res.status(200).json({ token, type: user.type });

        }
      });
    }
  });
});

//**********************************Gestion des clients****************************************/

  route.get("/api/getAllClients", clientController.getAllClients);
  route.put("/api/updateClient/:email",(req, res) => {
    const email=req.params.email;
    const {nom,prenom,tel ,photo}=req.body;
    const query = "UPDATE client SET nom = ?, prenom = ?, tel= ? , photo=? WHERE email = ?";
  connection.query(query,[nom, prenom,tel,photo,email],(err, rows) => {
    if (err) {
      console.error("Error executing query: " + err.stack);
      return;
    }
    console.log("Result rows:", rows);
    res.json( rows);
  });
    } );
  route.post("/api/SignUp", clientController.insertClient);
  route.put("/api/verifyUser/:activeCode", clientController.verifyUser);
  route.delete("/api/deleteClient/:CIN", clientController.deleteClient);
  route.get("/api/getClientbyCIN/:CIN", clientController.getClientbyCIN);
  route.get("/api/clients/search/:value", clientController.searchClients);
  const { getAllClients } = require('../controllers/gestionClients');
  route.get("/api/getInfosClient/:email",(req, res) => {
    const email=req.params.email;
    const query = "SELECT * FROM client where email=?";
    connection.query(query,email ,(err, rows) => {
  if (err) {
    console.error("Error executing query: " + err.stack);
    return;
  }
  console.log("Result rows:", rows);
  res.json( rows);
 });
});


   
//**********************************Gestion des personnels****************************************/
 
  route.get("/api/getAllpersonnels/:refCentre", personnelController.getAllPersonnels);
   route.put("/api/updatePerso/:CIN", personnelController.updatePersonnel);
  route.delete("/api/deletePerso/:CIN", personnelController.deletePersonnel);
  route.get("/api/personnels/search/:value", personnelController.searchPersonnel);
  route.get("/api/NBpersonnels/:refCentre", personnelController.getNbPersonnelsByCentre);
  route.get("/api/getOnepersonnel/:CIN", personnelController.getOnePersonnelByRef);
  route.get("/api/getAllClients", clientController.getAllClients);

  route.post("/api/insertPerso/:refCentre", (req, res) => {
    const reference = req.params.refCentre;
    const { CIN, nom, prenom, sexe, email, photo, fonction, nomService, tel, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const token = jwt.sign({ email }, "sECRTkeyS");
    const isActive=0;
    const activeCode = token;
    console.log(token)
    const query1 = "INSERT INTO personnel (CIN, nom, prenom, sexe, email, tel, password, photo, refCentre,isActive,activeCode) VALUES (?,?,?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const query2 = "SELECT servicecentre.refService FROM servicecentre INNER JOIN service ON servicecentre.refService = service.reference INNER JOIN centre ON servicecentre.refCentre = centre.reference WHERE service.nomService = ? AND centre.reference = ?";
    const query3 = "INSERT INTO tacheperso (refService, fonction, CinPersonnel) VALUES (?, ?, ?)";

    const values1 = [CIN, nom, prenom, sexe, email, tel, hashedPassword, photo, reference,isActive,activeCode];
    
    let successCount = 0; // initialiser le compteur à 0
    let finalResult = []; // initialiser le résultat final à un tableau vide

    connection.query(query1, values1, (err, rows1) => {
        if (err) {
            console.error("Error executing query 1: " + err.stack);
            res.status(500).json({ error: "Internal server error" }); // envoyer une réponse d'erreur en cas d'erreur SQL
            return;
        }
        console.log("Result rows 1:", rows1);
        finalResult.push(rows1); // ajouter le résultat de la requête SQL au résultat final
        successCount++; // augmenter le compteur de requêtes SQL réussies

        connection.query(query2, [nomService, reference], (err, rows2) => {
            if (err) {
                console.error("Error executing query 2: " + err.stack);
                res.status(500).json({ error: "Internal server error" }); // envoyer une réponse d'erreur en cas d'erreur SQL
                return;
            }
            console.log("La reference de service :", rows2[0].refService);
            const refService = rows2[0].refService;
            const values3 = [refService, fonction, CIN];
            connection.query(query3, values3, (err, rows3) => {
                if (err) {
                    console.error("Error executing query 3: " + err.stack);
                    res.status(500).json({ error: "Internal server error" }); // envoyer une réponse d'erreur en cas d'erreur SQL
                    return;
                }
                console.log("Result rows 3:", rows3);
                finalResult.push(rows3); // ajouter le résultat de la requête SQL au résultat final
                successCount++; // augmenter le compteur de requêtes SQL réussies

                // si toutes les requêtes SQL ont été effectuées avec
                if (successCount === 2) {
                  res.json({ success: true, data: finalResult });
                  sendConfirmationEmail(email, activeCode);
                  }
                  });
                  });
                  });
                  });
  route.put("/api/verifyPerso/:activeCode", personnelController.verifyPersonnel);
  route.get("/api/getAllpersonnelResv", (req, res) => {
    const service = req.query.nomService;
    const nomSalon = req.query.nomCentre;
  
    const sql = "SELECT *, personnel.nom AS persoName FROM tachePerso INNER JOIN personnel ON tacheperso.CinPersonnel = personnel.CIN INNER JOIN service ON tacheperso.refService = service.reference INNER JOIN centre ON centre.reference = personnel.refCentre WHERE service.nomService = ? AND centre.nom =?";
    
    connection.query(sql, [service, nomSalon], (err, rows) => {
      if (err) {
        console.error("Error executing query: " + err.stack);
        return res.status(500).json({ error: "An error occurred" });
      }
      
      console.log("Result rows perso res:", rows);
      res.json(rows);
    });
  });
  
//**********************************Gestion des centres****************************************/
route.get("/api/heureCalendrier/:refCentre", (req, res) => {
const refCentre = req.params.refCentre;
const currentDate = new Date();
const day = format(currentDate, "EEEE", { locale: fr });

  const query =
    "SELECT heure.ouverture, heure.fermeture, horaire.jour FROM horaire INNER JOIN heure ON heure.refHoraire = horaire.reference WHERE heure.refCentre = ?";
  connection.query(query, refCentre, (err, rows) => {
    if (err) {
      console.error("Error executing query: " + err.stack);
      return;
    }
    console.log("Result rows:", rows);

    const joursSemaine = [
      "Lundi",
      "Mardi",
      "Mercredi",
      "Jeudi",
      "Vendredi",
      "Samedi",
      "Dimanche",
    ];

    const joursRowsMap = new Map();

    rows.forEach((row) => {
      const lowercasedJour = row.jour.toLowerCase();
      if (joursRowsMap.has(lowercasedJour)) {
        const existingRow = joursRowsMap.get(lowercasedJour);
        if (!existingRow.ouverture && !existingRow.fermeture) {
          existingRow.ouverture = row.ouverture;
          existingRow.fermeture = row.fermeture;
        }
      } else {
        joursRowsMap.set(lowercasedJour, { ouverture: row.ouverture, fermeture: row.fermeture });
      }
    });

    const startIndex = joursSemaine.findIndex((jour) => jour.toLowerCase() === day);

    const filteredRows = joursSemaine.slice(startIndex).concat(joursSemaine.slice(0, startIndex)).map((jour) => {
      const lowercasedJour = jour.toLowerCase();
      if (joursRowsMap.has(lowercasedJour)) {
        return { jour, ...joursRowsMap.get(lowercasedJour) };
      } else {
        return { jour, ouverture: null, fermeture: null };
      }
    });

    res.json(filteredRows);
  });
});
route.get("/api/getAll/:ville",(req,res)=>{
  const ville=req.params.ville;
  const query =  "SELECT image.src,succursale.adresse, centre.nom FROM centre INNER JOIN image ON centre.reference = image.refCentre INNER JOIN succursale ON centre.reference = succursale.refCentre INNER JOIN ville ON ville.code = succursale.codeVille  WHERE ville.nom = ? and couverture=1";
  connection.query(query,ville,(err, rows) => {
    if (err) {
      console.error("Error executing query: " + err.stack);
      return;
    }
    console.log("Result rows:", rows);
    res.json( rows);
  });
})
route.get("/api/getCentresProp/:CIN",(req,res)=>{
  const id = req.params.CIN;
  const query =  "SELECT centre.reference, image.src, centre.nom, centre.type FROM centre INNER JOIN image ON centre.reference = image.refCentre AND couverture = 1 WHERE centre.Cinprop ="+id;
  connection.query(query,(err, rows) => {
    if (err) {
      console.error("Error executing query: " + err.stack);
      return;
    }
    console.log("Result rows:", rows);
    res.json( rows);
  });
})
route.get("/api/getAllPropriate/:CIN",(req,res)=>{
  const id = req.params.CIN;
  const query =  "SELECT * FROM proprietaire WHERE CIN="+id;
  connection.query(query,(err, rows) => {
    if (err) {
      console.error("Error executing query: " + err.stack);
      return;
    }
    console.log("Result rows:", rows);
    res.json( rows);
  });
})
route.get("/api/getHoraireCentre/:nomCentre",(req,res)=>{
  const nomCentre = req.params.nomCentre;
  const query = "SELECT heure.ouverture, heure.fermeture, horaire.jour FROM horaire INNER JOIN heure ON heure.refHoraire = horaire.reference INNER JOIN centre ON centre.reference=heure.refCentre WHERE centre.nom =?";
  connection.query(query,nomCentre, (err, rows) => {
    if (err) {
      console.error("Error executing query: " + err.stack);
      return;
    }
    console.log("Result rows:", rows);
    res.json( rows);
  });
})
route.get("/api/getAvisCentre/:nomCentre",(req,res)=>{
  const nomCentre = req.params.nomCentre;
  const query = "SELECT * from avis WHERE refCentre=?";
  connection.query(query,nomCentre, (err, rows) => {
    if (err) {
      console.error("Error executing query: " + err.stack);
      return;
    }
    console.log("Result rows:", rows);
    res.json( rows);
  });
})
route.get("/api/getCentreByref/:ref",(req,res)=>{
  const id = req.params.ref;
  const query = "SELECT * FROM centre WHERE reference =?";
  connection.query(query,id, (err, rows) => {
    if (err) {
      console.error("Error executing query: " + err.stack);
      return;
    }
    console.log("Result rows:", rows);
    res.json( rows);
  });
})
route.get("/api/avis/:ref",(req,res)=>{
  const id = req.params.ref;
  const query = "SELECT * FROM avis WHERE etat=0 and CINClient =?";
  connection.query(query,id, (err, rows) => {
    if (err) {
      console.error("Error executing query: " + err.stack);
      return;
    }
    console.log("Result rows:", rows);
    res.json( rows);
  });
})
route.get("/api/getclientByref/:ref",(req,res)=>{
  const id = req.params.ref;
  const query = "SELECT * FROM client WHERE CIN =?";
  connection.query(query,id, (err, rows) => {
    if (err) {
      console.error("Error executing query: " + err.stack);
      return;
    }
    console.log("Result rows:", rows);
    res.json( rows);
  });
})
route.get("/api/getservByref/:ref",(req,res)=>{
  const id = req.params.ref;
  const query = "SELECT s.reference, s.nomService, s.prix FROM reservation r JOIN servicecentre sc ON r.refCentre = sc.refCentre AND r.refService = sc.refService JOIN service s ON sc.refService = s.reference WHERE r.reference = ?";
  connection.query(query,id, (err, rows) => {
    if (err) {
      console.error("Error executing query: " + err.stack);
      return;
    }
    console.log("Result rows:", rows);
    res.json( rows);
  });
})
route.get("/api/getresvByref/:ref",(req,res)=>{
  const id = req.params.ref;
  const query = "SELECT * FROM reservation WHERE reference =?";
  connection.query(query,id, (err, rows) => {
    if (err) {
      console.error("Error executing query: " + err.stack);
      return;
    }
    console.log("Result rows:", rows);
    res.json( rows);
  });
})
route.get("/api/getRev/:ref",(req,res)=>{
  const id = req.params.ref;
  const query = "SELECT * FROM reservation WHERE reference ="+id;
  connection.query(query, (err, rows) => {
    if (err) {
      console.error("Error executing query: " + err.stack);
      return;
    }
    console.log("Result rows:", rows);
    res.json( rows);
  });
})
route.get("/api/personnel/:nomCentre",(req,res)=>{
    const nomCentre = req.params.nomCentre;
    const query = "SELECT * FROM personnel WHERE refCentre=?"
    connection.query(query,nomCentre, (err, rows) => {
      if (err) {
        console.error("Error executing query: " + err.stack);
        return;
      }
      console.log("Result rows:", rows);
      res.json( rows);
    });
  })
  route.get("/api/reservation/:nomCentre",(req,res)=>{
    const nomCentre = req.params.nomCentre;
    const query = "SELECT * FROM avis WHERE refCentre=?"
    connection.query(query,nomCentre, (err, rows) => {
      if (err) {
        console.error("Error executing query: " + err.stack);
        return;
      }
      console.log("Result rows:", rows);
      res.json( rows);
    });
  })
  route.get("/api/getCentreById/:nomCentre",(req,res)=>{
    const nomCentre = req.params.nomCentre;
    const query = "SELECT * FROM centre WHERE reference=?"
    connection.query(query,nomCentre, (err, rows) => {
      if (err) {
        console.error("Error executing query: " + err.stack);
        return;
      }
      console.log("Result rows:", rows);
      res.json( rows);
    });
  })
  route.get("/api/getReservationCentre/:nomCentre",(req,res)=>{
    const nomCentre = req.params.nomCentre;
    const query = "SELECT * FROM reservation WHERE refCentre=?"
    connection.query(query,nomCentre, (err, rows) => {
      if (err) {
        console.error("Error executing query: " + err.stack);
        return;
      }
      console.log("Result rows:", rows);
      res.json( rows);
    });
  })

route.get("/api/getHorairePerso/:CIN",(req,res)=>{
  const CIN = req.params.CIN;
  const query = "SELECT heure.ouverture, heure.fermeture, horaire.jour FROM horaire INNER JOIN heure ON heure.refHoraire = horaire.reference  INNER JOIN personnel ON personnel.CIN=heure.CinPersonnel WHERE personnel.CIN =?";
  connection.query(query,CIN, (err, rows) => {
    if (err) {
      console.error("Error executing query: " + err.stack);
      return;
    }
    console.log("Result rows:", rows);
    res.json( rows);
  });
})
route.get("/api/heureCalendrierPerso/:CIN", (req, res) => {
  const CIN = req.params.CIN;
  const currentDate = new Date();
  const day = format(currentDate, "EEEE", { locale: fr });
  
    const query =
      "SELECT heure.ouverture, heure.fermeture, horaire.jour FROM horaire INNER JOIN heure ON heure.refHoraire = horaire.reference WHERE heure.CinPersonnel = ?";
    connection.query(query,CIN, (err, rows) => {
      if (err) {
        console.error("Error executing query: " + err.stack);
        return;
      }
      console.log("Result rows:", rows);
  
      const joursSemaine = [
        "Lundi",
        "Mardi",
        "Mercredi",
        "Jeudi",
        "Vendredi",
        "Samedi",
        "Dimanche",
      ];
  
      const joursRowsMap = new Map();
  
      rows.forEach((row) => {
        const lowercasedJour = row.jour.toLowerCase();
        if (joursRowsMap.has(lowercasedJour)) {
          const existingRow = joursRowsMap.get(lowercasedJour);
          if (!existingRow.ouverture && !existingRow.fermeture) {
            existingRow.ouverture = row.ouverture;
            existingRow.fermeture = row.fermeture;
          }
        } else {
          joursRowsMap.set(lowercasedJour, { ouverture: row.ouverture, fermeture: row.fermeture });
        }
      });
  
      const startIndex = joursSemaine.findIndex((jour) => jour.toLowerCase() === day);
  
      const filteredRows = joursSemaine.slice(startIndex).concat(joursSemaine.slice(0, startIndex)).map((jour) => {
        const lowercasedJour = jour.toLowerCase();
        if (joursRowsMap.has(lowercasedJour)) {
          return { jour, ...joursRowsMap.get(lowercasedJour) };
        } else {
          return { jour, ouverture: null, fermeture: null };
        }
      });
  
      res.json(filteredRows);
    });
  });
route.get("/api/get",(req,res)=>{
    const query = "SELECT * FROM ville";
    connection.query(query, (err, rows) => {
      if (err) {
        console.error("Error executing query: " + err.stack);
        return;
      }
      console.log("Result rows:", rows);
      res.json( rows);
    });
  })
  route.get("/api/getAllPersonnel/:refenence",(req,res)=>{
    const id=req.params.refenence;
    const query = "SELECT * FROM personnel WHERE CIN="+id;
    connection.query(query, (err, rows) => {
      if (err) {
        console.error("Error executing query: " + err.stack);
        return;
      }
      console.log("Result rows:", rows);
      res.json( rows);
    });
  })

  route.get("/api/getAll",(req,res)=>{
    const ville=req.query.ville;
    const type=req.query.type;
    const query =  "SELECT image.src,succursale.adresse, centre.nom FROM centre INNER JOIN image ON centre.reference = image.refCentre INNER JOIN succursale ON centre.reference = succursale.refCentre INNER JOIN ville ON ville.code = succursale.codeVille  WHERE ville.nom = ? and couverture=1 and centre.type=?";
    connection.query(query,[ville,type],(err, rows) => {
      if (err) {
        console.error("Error executing query: " + err.stack);
        return;
      }
      console.log("Result rows:", rows);
      res.json( rows);
    });
  })
  route.get("/api/getByVille/:ville",(req,res)=>{
    const ville=req.params.ville;
    const query = "SELECT * FROM centre INNER JOIN succursale ON centre.reference = succursale.refCentre INNER JOIN ville ON ville.code = succursale.codeVille WHERE ville.nom = ?";
        connection.query(query,ville ,(err, rows) => {
      if (err) {
        console.error("Error executing query: " + err.stack);
        return;
      }
      console.log("Result rows:", rows);
      res.json( rows);
    });
  })

  route.get("/api/getByName/:nom",(req,res)=>{
    const nom=req.params.nom;
    const query ="SELECT * FROM centre INNER JOIN image ON centre.reference = image.refCentre INNER JOIN succursale  ON centre.reference = succursale.refCentre WHERE centre.nom =?";
  
    connection.query(query,nom,(err, rows) => {
      if (err) {
        console.error("Error executing query: " + err.stack);
        return;
      }
      console.log("Result rows:", rows);
      res.json( rows);
    });
  })

  route.get("/api/getAdresse/:nom",(req,res)=>{
    const nom=req.params.nom;
    const query =  "SELECT adresse,localisation FROM succursale INNER JOIN centre ON centre.reference = succursale.refCentre and centre.nom=?";
    connection.query(query,nom,(err, rows) => {
      if (err) {
        console.error("Error executing query: " + err.stack);
        return;
      }
      console.log("Result rows:", rows);
      res.json( rows);
    });
  })

  route.get("/api/getByImage/:nom",(req,res)=>{
    const nom=req.params.nom;
  const query =  "SELECT * FROM centre INNER JOIN image ON centre.reference = image.refCentre WHERE image.couverture =0  AND centre.nom = ? ";
    connection.query(query,nom,(err, rows) => {
      if (err) {
        console.error("Error executing query: " + err.stack);
        return;
      }
      console.log("Result rows:", rows);
      res.json( rows);
    });
  })
  route.get("/api/getByImageRef/:ref",(req,res)=>{
    const ref=req.params.ref;
  const query =  "SELECT * FROM centre INNER JOIN image ON centre.reference = image.refCentre WHERE centre.reference = ? ";
    connection.query(query,ref,(err, rows) => {
      if (err) {
        console.error("Error executing query: " + err.stack);
        return;
      }
      console.log("Result rows:", rows);
      res.json( rows);
    });
  })
  route.get("/api/getPremierImage/:nom",(req,res)=>{
    const nom=req.params.nom;
    const query =  "SELECT src,nom FROM centre INNER JOIN image ON centre.reference = image.refCentre WHERE centre.nom = ?";
    connection.query(query,nom,(err, rows) => {
      if (err) {
        console.error("Error executing query: " + err.stack);
        return;
      }
      console.log("Result rows:", rows);
      res.json( rows);
    });
  })
  route.get("/api/getp",(req,res)=>{
    const id = req.params.CIN;
    const query =  "SELECT * FROM personnel";
    connection.query(query,(err, rows) => {
      if (err) {
        console.error("Error executing query: " + err.stack);
        return;
      }
      console.log("Result rows:", rows);
      res.json( rows);
    });
  })

route.get("/api/getNamesEtab/:nom",(req,res)=>{
    const nom=req.params.nom;
    const query =  "SELECT * FROM centre  where nom=?";
    connection.query(query,nom,(err, rows) => {
      if (err) {
        console.error("Error executing query: " + err.stack);
        return;
      }
      console.log("Result rows:", rows);
      res.json( rows);
    });
  })
  route.get("/api/getCentre",(req,res)=>{
    
    const query =  "SELECT * FROM centre ";
    connection.query(query,(err, rows) => {
      if (err) {
        console.error("Error executing query: " + err.stack);
        return;
      }
      console.log("Result rows:", rows);
      res.json( rows);
    });
  })


route.get("/api/getIdEtab/:id",(req,res)=>{
    const id=req.params.id;
    const query =  "SELECT * FROM centre where reference=?";
    connection.query(query,id,(err, rows) => {
      if (err) {
        console.error("Error executing query: " + err.stack);
        return;
      }
      console.log("Result rows:", rows);
      res.json( rows);
    });
  })
  route.get("/api/getPersonnelByNameCentre/:nomCentre",(req,res)=>{
    const nomCentre=req.params.nomCentre;
    const query =  "SELECT personnel.nom,personnel.prenom ,personnel.CIN FROM personnel INNER JOIN centre ON personnel.refCentre = centre.reference WHERE centre.nom =? ";
    connection.query(query,nomCentre,(err, rows) => {
      if (err) {
        console.error("Error executing query: " + err.stack);
        return;
      }
      console.log("Result rows:", rows);
      res.json( rows);
    });
  })

route.get("/api/getNamesEtab",(req,res)=>{
    const nom=req.params.nom;
    const query =  "SELECT centre.reference,src,centre.nom,centre.type FROM centre INNER JOIN image ON centre.reference = image.refCentre and couverture=1 ";
    connection.query(query,nom,(err, rows) => {
      if (err) {
        console.error("Error executing query: " + err.stack);
        return;
      }
      console.log("Result rows:", rows);
      res.json( rows);
    });
  })

  route.get("/api/getMail/:email",(req,res)=>{
    const email=req.params.email;
    const query =  "SELECT email FROM ( SELECT email FROM centre UNION ALL SELECT email FROM personnel UNION ALL SELECT email FROM client ) AS emails WHERE email=? ";
    connection.query(query,email,(err, rows) => {
      if (err) {
        console.error("Error executing query: " + err.stack);
        return;
      }
      console.log("Result rows:", rows);
      res.json( rows);
    });
  })
  route.get("/api/user/:email",(req,res)=>{
    const email=req.params.email;
    const query =  "SELECT * FROM ( SELECT nom, type FROM centre UNION ALL SELECT nom,prenom FROM personnel UNION ALL SELECT nom,prenom FROM client ) AS noms WHERE email=? ";
    connection.query(query,email,(err, rows) => {
      if (err) {
        console.error("Error executing query: " + err.stack);
        return;
      }
      console.log("Result rows:", rows);
      res.json( rows);
    });
  })
  route.get("/api/getCIN/:cin",(req,res)=>{
    const CIN=req.params.cin;
    const query =  "SELECT CIN FROM personnel WHERE CIN=? ";
    connection.query(query,CIN,(err, rows) => {
      if (err) {
        console.error("Error executing query: " + err.stack);
        return;
      }
      console.log("Result rows:", rows);
      res.json( rows);
    });
  })
  route.get("/api/confirm/:activeCode",(req,res)=>{
    const email=req.params.email;
    const query =  "SELECT email FROM ( SELECT email FROM centre UNION ALL SELECT email FROM personnel UNION ALL SELECT email FROM client ) AS emails WHERE email=? ";
    connection.query(query,email,(err, rows) => {
      if (err) {
        console.error("Error executing query: " + err.stack);
        return;
      }
      console.log("Result rows:", rows);
      res.json( rows);
    });
  })
  
route.get("/api/getChoixSalon",(req,res)=>{
    const query =  "SELECT DISTINCT type from centre ";
    connection.query(query,(err, rows) => {
      if (err) {
        console.error("Error executing query: " + err.stack);
        return;
      }
      console.log("Result rows:", rows);
      res.json( rows);
    });
  })
  

  route.get("/api/getTachePerso/:CIN",(req,res)=>{
    const CIN=req.params.CIN;
    const query =  "SELECT * FROM personnel INNER JOIN tachePerso ON personnel.CIN = tachePerso.cinPersonnel INNER JOIN service ON tacheperso.refService = service.reference where CINPersonnel= ? ";
    connection.query(query,CIN,(err, rows) => {
      if (err) {
        console.error("Error executing query: " + err.stack);
        return;
      }
      console.log("Result rows:", rows);
      res.json( rows);
    });
  })
  route.post("/api/InsertTachePerso/:CIN", (req, res) => {
    const CIN = req.params.CIN;
    const { nomService, fonction } = req.body;
    const query2 = "SELECT reference FROM service WHERE nomService = ?";
    const query = "INSERT INTO tacheperso (refService, fonction, CinPersonnel) VALUES (?, ?, ?)";
  
    let successCount = 0; // initialiser le compteur à 0
    let finalResult = []; // initialiser le résultat final à un tableau vide
  
    connection.query(query2, [nomService], (err, rows2) => {
      if (err) {
        console.error("Error executing query 2: " + err.stack);
        res.status(500).json({ error: "Internal server error" }); // envoyer une réponse d'erreur en cas d'erreur SQL
        return;
      }
      console.log("La reference de service :", rows2[0].reference);
      const refService = rows2[0].reference;
      const values = [refService, fonction, CIN];
      connection.query(query, values, (err, rows3) => {
        if (err) {
          console.error("Error executing query 3: " + err.stack);
          res.status(500).json({ error: "Internal server error" }); // envoyer une réponse d'erreur en cas d'erreur SQL
          return;
        }
        console.log("Result rows 3:", rows3);
        finalResult.push(rows3); // ajouter le résultat de la requête SQL au résultat final
        successCount++; // augmenter le compteur de requêtes SQL réussies
  
        // si toutes les requêtes SQL ont été effectuées avec succès
        if (successCount === 1) {
          res.json({ success: true, data: finalResult });
        }
      });
    });
  });

  route.get("/api/deletePersoTache/:CIN", (req, res) => {
    const CIN = req.params.CIN;
    const {fonction,nomService}=req.body;
    const query2 = "SELECT reference FROM service WHERE nomService = ?";
    const query = "DELETE FROM tacheperso WHERE CINPersonnel = ? and fonction=? and refService=?";
  
    let successCount = 0; // initialiser le compteur à 0
    let finalResult = []; // initialiser le résultat final à un tableau vide
  
    connection.query(query2, [nomService], (err, rows2) => {
      if (err) {
        console.error("Error executing query 2: " + err.stack);
        res.status(500).json({ error: "Internal server error" }); // envoyer une réponse d'erreur en cas d'erreur SQL
        return;
      }
      console.log("La reference de service :", rows2[0].reference);
      const refService = rows2[0].reference;
      const values = [CIN,fonction ,refService] ;
      connection.query(query, values, (err, rows3) => {
        if (err) {
          console.error("Error executing query 3: " + err.stack);
          res.status(500).json({ error: "Internal server error" }); // envoyer une réponse d'erreur en cas d'erreur SQL
          return;
        }
        console.log("Result rows 3:", rows3);
        finalResult.push(rows3); // ajouter le résultat de la requête SQL au résultat final
        successCount++; // augmenter le compteur de requêtes SQL réussies
  
        // si toutes les requêtes SQL ont été effectuées avec succès
        if (successCount === 1) {
          res.json({ success: true, data: finalResult });
        }
      });
    });
  });
  
route.get("/api/getResvPerso/:CIN",(req,res)=>{
    id=req.params.CIN
    const query =  "SELECT client.nom,personnel.nom,service.nomService,startDateResv,endDateResv FROM reservation INNER JOIN client ON reservation.CINClient = client.CIN INNER JOIN service ON reservation.refService = service.reference INNER JOIN personnel ON reservation.CINPersonnel = personnel.CIN WHERE personnel.CIN= ? and reservation.refCentre=1;";
    connection.query(query,id,(err, rows) => {
      if (err) {
        console.error("Error executing query: " + err.stack);
        return;
      }
      console.log("Result rows:", rows);
      res.json( rows);
    });
  })
 

  route.post("/api/addResvPerso", (req, res) => {
    const { cinPersonnel,cinClient, nomSalon, nomService, selectedTime} = req.body;
    console.log("avant"+cinPersonnel,cinClient, nomSalon, nomService, selectedTime)
    const query1 = "SELECT duree, reference FROM service WHERE nomService = ?";
    const query2 = "SELECT reference FROM centre WHERE nom = ?";
    const query = "INSERT INTO reservation(startDateResv, endDateResv, CINClient, refService, CinPersonnel, refCentre) VALUES (?, ?, ?, ?, ?, ?)";
  
    let successCount = 0; // initialiser le compteur à 0
    let finalResult = []; // initialiser le résultat final à un tableau vide
  
    connection.query(query1, [nomService], (err, rows1) => {
      if (err) {
        console.error("Error executing query 1: " + err.stack);
        res.status(500).json({ error: "Internal server error" });
        return;
      }
  
      if (rows1.length === 0) {
        // Handle the case where no rows were returned
        res.status(404).json({ error: "Service not found" });
        return;
      }
  
      console.log("Result rows 1:", rows1);
      const refService = rows1[0].reference;
      const duree = rows1[0].duree;
      finalResult.push(rows1[0]); // ajouter le résultat de la requête SQL au résultat final
      successCount++; // augmenter le compteur de requêtes SQL réussies
  
      connection.query(query2, [nomSalon], (err, rows2) => {
        if (err) {
          console.error("Error executing query 2: " + err.stack);
          res.status(500).json({ error: "Internal server error" });
          return;
        }
  
        if (rows2.length === 0) {
          // Handle the case where no rows were returned
          res.status(404).json({ error: "Centre not found" });
          return;
        }
  
        console.log("La reference du centre :", rows2[0].reference);
  
        const refCentre = rows2[0].reference;
        const durationString = duree.toString(); // Replace with your duration string (e.g., '01:00:00', '00:30:00')
            
        
const dateTime = new Date(selectedTime);

const durationParts = durationString.split(":");
const hours = parseInt(durationParts[0], 10);
const minutes = parseInt(durationParts[1], 10);
const seconds = parseInt(durationParts[2], 10);

const updatedDateTime = new Date(
  dateTime.getTime() + hours * 3600000 + minutes * 60000 + seconds * 1000
);

const updatedHours = updatedDateTime.getHours().toString().padStart(2, "0");
const updatedMinutes = updatedDateTime.getMinutes().toString().padStart(2, "0");
const updatedSeconds = updatedDateTime.getSeconds().toString().padStart(2, "0");

const updatedDateTimeString = `${updatedDateTime.getFullYear()}-${(
  updatedDateTime.getMonth() + 1
)
  .toString()
  .padStart(2, "0")}-${updatedDateTime
  .getDate()
  .toString()
  .padStart(2, "0")} ${updatedHours}:${updatedMinutes}:${updatedSeconds}`;

console.log(updatedDateTimeString);
      
    console.log("apresss"+selectedTime,updatedDateTimeString, cinClient, refService, cinPersonnel, refCentre)
        
        const values3 = [selectedTime,updatedDateTimeString, cinClient, refService, cinPersonnel, refCentre];
    

connection.query(query, values3, (err, rows3) => {
  if (err) {
    console.error("Error executing query 3: " + err.stack);
    res.status(500).json({ error: "Internal server error" }); // envoyer une réponse d'erreur en cas d'erreur SQL
    return;
  }

  console.log("Result rows 3:", rows3);
  finalResult.push(rows3); // ajouter le résultat de la requête SQL au résultat final
  successCount++; // augmenter le compteur de requêtes SQL réussies

  // si toutes les requêtes SQL ont été effectuées avec succès
  if (successCount === 2) {
    res.json({ success: true, data: finalResult });
  }
});

})
  })
});

 route.post("/api/addResv", (req, res) => {
    const {refCentre, startDate, endDate,titre} = req.body;
      const query = "INSERT INTO reservation(startDateResv, endDateResv, titre,refCentre) VALUES (?, ?, ?, ?)";
      connection.query(query, [ startDate, endDate,titre,refCentre], (err, rows) => {
        if (err) {
          console.error("Error executing query: " + err.stack);
          return;
        }
        console.log("Result rows:", rows);
        res.json(rows);
      });
    })
  
    route.get("/api/getReservation/:refCentre", (req, res) => {
      const refCentre = req.params.refCentre;
      const query = `
        SELECT
          IFNULL(client.nom, NULL) AS nom,
          IFNULL(client.prenom, NULL) AS prenom,
          IFNULL(client.photo, NULL) AS photo,
          IFNULL(personnel.photo, NULL) AS photoPerso,
          IFNULL(personnel.nom, NULL) AS nomPerso,
          IFNULL(personnel.prenom, NULL) AS prenomPerso,
          IFNULL(service.nomService, NULL) AS nomService,
          IFNULL(reservation.titre, NULL) AS titre,
          startDateResv,
          endDateResv
        FROM
          reservation
          LEFT JOIN client ON reservation.CINClient = client.CIN
          LEFT JOIN service ON reservation.refService = service.reference
          LEFT JOIN personnel ON reservation.CINPersonnel = personnel.CIN
        WHERE
          reservation.refCentre = ?;
      `;
    
      connection.query(query, refCentre, (err, rows) => {
        if (err) {
          console.error("Error executing query: " + err.stack);
          return;
        }
        console.log("Result rows:", rows);
        res.json(rows);
      });
    });
    route.get("/api/getResvC/:CIN",(req,res)=>{
      const id = req.params.CIN;
      const query =  "SELECT * FROM reservation WHERE etat=? and refCentre=?";
      connection.query(query,["0",id],(err, rows) => {
        if (err) {
          console.error("Error executing query: " + err.stack);
          return;
        }
        console.log("Result rows:", rows);
        res.json( rows);
      });
    })
      route.get("/api/getResvClient/:email", (req, res) => {
        const email = req.params.email;
      
        const query1 = "SELECT CIN FROM client WHERE email = ?";
        const query2 = "SELECT reservation.reference,service.nomService,service.duree,service.prix,startDateResv,endDateResv,centre.nom ,image.src FROM reservation INNER JOIN service ON reservation.refService = service.reference INNER JOIN centre ON reservation.refCentre = centre.reference INNER JOIN image ON reservation.refCentre = image.refCentre WHERE CINClient=? and couverture=1";
        connection.query(query1, [email], (err, rows1) => {
          if (err) {
            console.error("Error executing query1: " + err.stack);
            return;
          }
      
          const CIN = rows1[0].CIN;
      
          connection.query(query2, [CIN], (err, rows2) => {
            if (err) {
              console.error("Error executing query2: " + err.stack);
              return;
            }
            
            console.log("Result rows:", rows2);
            res.json(rows2);
          });
        });
      });
      route.delete("/api/deleteResv/:reference",(req,res) => {
        const reference=req.params.reference;
        var sql = "DELETE FROM reservation WHERE reference = ?";
        connection.query(sql,reference,function (err, rows){
          if (err) {
            console.error("Error executing query: " + err.stack);
            return;
          }
          console.log("Result rows:", rows);
          res.json( rows);
        });
        }); 
        route.put("/api/updateResv/:reference", (req, res) => {
          const reference = req.params.reference;
          const startDate = req.body.startDate;
          
          const query = "SELECT service.duree FROM reservation INNER JOIN service ON service.reference = reservation.refService WHERE reservation.reference = ?";
          const sql = "UPDATE reservation SET startDateResv = ?, endDateResv = ? WHERE reference = ?";
        
          connection.query(query, [reference], function (err, rows2) {
            if (err) {
              console.error("Error executing query: " + err.stack);
              res.status(500).json({ error: "Internal server error" });
              return;
            }
        
            if (rows2.length === 0) {
              // Handle the case where no rows were returned
              res.status(404).json({ error: "Service not found" });
              return;
            }
        
            console.log("Result rows 2:", rows2);
            const durationString = rows2[0].duree;
            
            const dateTime = new Date(startDate);
        
            const durationParts = durationString.split(":");
            const hours = parseInt(durationParts[0], 10);
            const minutes = parseInt(durationParts[1], 10);
            const seconds = parseInt(durationParts[2], 10);
        
            const updatedDateTime = new Date(
              dateTime.getTime() + hours * 3600000 + minutes * 60000 + seconds * 1000
            );
        
            const updatedHours = updatedDateTime.getHours().toString().padStart(2, "0");
            const updatedMinutes = updatedDateTime.getMinutes().toString().padStart(2, "0");
            const updatedSeconds = updatedDateTime.getSeconds().toString().padStart(2, "0");
        
            const updatedDateTimeString = `${updatedDateTime.getFullYear()}-${(
              updatedDateTime.getMonth() + 1
            )
              .toString()
              .padStart(2, "0")}-${updatedDateTime
              .getDate()
              .toString()
              .padStart(2, "0")} ${updatedHours}:${updatedMinutes}:${updatedSeconds}`;
        
            console.log(updatedDateTimeString);
        
            connection.query(sql, [startDate, updatedDateTimeString, reference], function (err, rows3) {
              if (err) {
                console.error("Error executing query: " + err.stack);
                res.status(500).json({ error: "Internal server error" });
                return;
              }
        
              console.log("Result rows 3:", rows3);
              res.json({ success: true });
            });
          });
        });
        
      
//**********************************Gestion des categories****************************************/

//View categories
route.get("/api/categories",(req,res) => {
  var sql = "SELECT * FROM categorie";
  connection.query(sql,function (err, rows){
    if (err) {
      console.error("Error executing query: " + err.stack);
      return;
    }
    console.log("Result rows:", rows);
    res.json( rows);
  });
  });

route.get("/api/categories/search/:value", (req, res) => {
  var nom = req.params.value;
  var sql = "SELECT * FROM categorie WHERE nom like '"+nom.toString()+"%'";
  connection.query(sql, function (error, result){
      if(error) {
          console.log("Error Connecting to DB2"+error);  
      }else {
          res.send({status: true, data: result});
      }
  });
});


route.put("/api/categories/update/:reference",(req,res) => {
  let sql = "UPDATE categorie SET nom='" +
      req.body.nom +
      "', description='" + 
      req.body.description +
      "' WHERE reference=" +
      req.params.reference;

  let query = connection.query(sql, (error,result) => {
      if(error){
          res.send({ status: false, message: "Categorie Updated Failed"});
      } else {
          res.send({ status: true, message: "Categorie Updated successfully"}); 
      }
  });
});
route.put("/api/addAvis/:reference",(req,res) => {
  const dateString = new Date();
  const formattedDate = dateString.toISOString().split("T")[0];
  let sql = "UPDATE avis SET commentaire='" +
      req.body.comm +
      "', note=" + 
      req.body.rating +
      ", etat=1" + 
      ", dateAvis = '"+ formattedDate + "'" +
      " WHERE reference=" +
      req.params.reference;

  let query = connection.query(sql, (error,result) => {
      if(error){
        console.log(error);
          res.send({ status: false, message: "Categorie Updated Failed"});
      } else {
          res.send({ status: true, message: "Categorie Updated successfully"}); 
      }
  });
});

//Delete categories

route.delete("/api/categories/delete/:reference",(req,res) => {
  let sql = "DELETE FROM categorie WHERE reference=" +
      req.params.reference;

  let query = connection.query(sql, (error,result) => {
      if(error){
          res.send({ status: false, message: "Categorie Deleted Failed"});
      } else {
          res.send({ status: true, message: "Categorie Deleted successfully"}); 
      }
  });
});
route.get("/api/getPropriates",(req,res)=>{
  const query =  "SELECT * FROM proprietaire";
  connection.query(query,(err, rows) => {
    if (err) {
      console.error("Error executing query: " + err.stack);
      return;
    }
    console.log("Result rows:", rows);
    res.json( rows);
  });
})
route.delete("/api/SupprimerProp/:reference",(req,res) => {
  let sql = "DELETE FROM proprietaire WHERE CIN=" + req.params.reference;

  let query = connection.query(sql, (error,result) => {
      if(error){
          res.send({ message: "Categorie Deleted Failed"});
      } else {
          res.send({ message: "Categorie Deleted successfully"}); 
      }
  });
});
route.delete("/api/deleteAvis/:reference",(req,res) => {
  let sql = "DELETE FROM avis WHERE reference=" + req.params.reference;

  let query = connection.query(sql, (error,result) => {
      if(error){
          res.send({ message: "Categorie Deleted Failed"});
      } else {
          res.send({ message: "Categorie Deleted successfully"}); 
      }
  });
});
//**********************************Gestion des services****************************************/

//View services

route.get("/api/services/:refCentre",(req,res) => {
  const refCentre=req.params.refCentre;
  const sql ="SELECT * FROM servicecentre INNER JOIN service ON servicecentre.refService = service.reference INNER JOIN centre ON servicecentre.refCentre = centre.reference WHERE centre.reference = ?";

  connection.query(sql,refCentre, (err, rows)=>{
    if (err) {
      console.error("Error executing query: " + err.stack);
      return;
    }
    console.log("Result rows:", rows);
    res.json( rows);
  });
});

route.get("/api/getService/:nomService",(req,res) => {
  const nomService=req.params.nomService;
  console.log(nomService)
  const sql ="SELECT * FROM service WHERE nomService = ?";
 // const sql ='SELECT * FROM service WHERE nomService ="Bain Kerastase Coupe Coiffage cheveux mi-longs"';

  connection.query(sql,nomService, (err, rows)=>{
    if (err) {
      console.error("Error executing query: " + err.stack);
      return;
    }
    console.log("Result rows:", rows);
    res.json( rows);
  });
});

//View services par nom centre
route.get("/api/servicesNomCentre/:nomCentre",(req,res) => {
  const nomCentre=req.params.nomCentre;
  var sql = "SELECT * FROM servicecentre INNER JOIN centre ON servicecentre.refCentre = centre.reference INNER JOIN service ON servicecentre.refService = service.reference INNER JOIN categorie ON service.refCateg = categorie.reference WHERE centre.nom = ? GROUP BY service.reference";
  connection.query(sql,nomCentre, function (error, rows){
      if(error) {
          console.log("1"); 
      }else {
        console.log("Result rows:", rows);
        res.json( rows);
      }
  });
});
route.post("/api/services/add/:refCentre",(req,res) => {
  const refCentre=req.params.refCentre;
  let details = {
      nom:req.body.nom,
      refCateg:1,
      prix:req.body.prix,
      duree:req.body.duree,
      description:req.body.description,
      refCentre:1
  };

  let sql = "INSERT INTO service SET ?";
  connection.query(sql,details,(error) => {
      if(error){
          res.send({ status: false, message: "Service created Failed"});
          console.log(" not ok"+error)
      } else {
          res.send({ status: true, message: "Service created successfully"}); 
          console.log(" not ok"+error)
      }
  });
});

//Search service

route.get("/api/services/search/:value", (req, res) => {
  var nom = req.params.value;
  var sql = "SELECT * FROM service WHERE nom like '"+nom.toString()+"%'";
  connection.query(sql, function (error, result){
      if(error) {
          console.log("Error Connecting to DB2"+error);  
      }else {
          res.send({status: true, data: result});
      }
  });
});

//Update service

route.put("/api/services/update/:reference",(req,res) => {
  let sql = "UPDATE service SET nom='" +
      req.body.nom +
      "', description='" + 
      req.body.description +
      "' , prix=" +
      req.body.prix +
      " , duree=" +
      req.body.duree +
      " WHERE reference=" +
      req.params.reference;

  let query = connection.query(sql, (error,result) => {
      if(error){
          res.send({ status: false, message: "Service Updated Failed"});
      } else {
          res.send({ status: true, message: "Service Updated successfully"}); 
      }
  });
});

//Delete service

route.delete("/api/services/delete/:reference",(req,res) => {
  let sql = "DELETE FROM service WHERE reference=" +
      req.params.reference;

  let query = connection.query(sql, (error,result) => {
      if(error){
          res.send({ status: false, message: "Service Deleted Failed"});
      } else {
          res.send({ status: true, message: "Service Deleted successfully"}); 
      }
  });
});
require("dotenv").config();
const stripe=require("stripe")(process.env.STRIPE_SECRET_TEST);
const bodyParser=require('body-parser');
route.use(bodyParser.urlencoded({ extended:true}));
route.use(bodyParser.json());
route.use(cors())
route.post("/stripe/charge/:reference",cors(),async(req,res)=>{
  let ref= req.params.reference
       let { amount, id} =req.body;
  try{
   const payment = await stripe.paymentIntents.create({
              amount:amount,
              currency:"EUR",
              description:"CLASSY Company",
              payment_method:id,
              confirm:true,
          });
  const dateString = new Date();
    const formattedDate = dateString.toISOString().split("T")[0];
    let details = {
        datePaiement: formattedDate
    };
        let sqlPaiment = "INSERT INTO paiement SET ?";
  connection.query(sqlPaiment,details,(error) => {
            if(error){
                console.log(" not ok"+error)
            } 
        });
   let selectPaiement = "SELECT max(reference) as ref FROM paiement";
        connection.query(selectPaiement, function (error, result){
  if(error) {
                console.log("Error Connecting to DB2"+error);  
            }else {
  console.log(result)
                const refpai=result[0].ref
                let detailsCentre = {
                  CinProp: ref,
                  refPaiement:refpai
              };
   let sqlPaiment = "INSERT INTO centre SET ? ";
                connection.query(sqlPaiment,detailsCentre,(error) => {
   if(error){
                        res.send({ status: false, message: "Service created Failed"});
                        console.log(" not ok"+error)
                    }
  else {
                      let selectC = "SELECT max(reference) as refCentre FROM centre";
                        connection.query(selectC, function (error, result){
                            if(error) {
                                console.log("Error Connecting to DB2"+error);  
                            }else {
                              console.log(result)
                                const refC=result[0].refCentre
                                res.json({
                                  message:"Payement réussi",
                                  success:true,
                                  reference:refC
                              })
                            }
                              })
                            }
  })
  }
  
  })
  
  }catch(error){
          console.log("Erreur Paymenet....",error)
          res.json({
              message:"Le Payement à échoué",
              success:false,
          })
        }
  
  })
  route.put("/api/addCentre/:refCentre",(req,res) => {
    const refCentre=req.params.refCentre;
    let sql = "UPDATE centre SET nom='" +
      req.body.nom +
      "', description='" + 
      req.body.description +
      "' , type='" +
      req.body.spec +
      "' , email='" +
      req.body.email +
      "' WHERE reference=" +
      refCentre;
      let img=req.body.images
    connection.query(sql,(error) => {
        if(error){
            res.send({ status: false, message: "Service created Failed"});
            console.log(" not ok"+error)
        } else {
           let sql2="INSERT INTO image set ?"
           const photo=img[0]
           let details = {
            refCentre:refCentre,
            src:photo,
            couverture:1
        };
           connection.query(sql2,details,(error) => {
            if(error){
                res.send({ status: false, message: "Service created Failed"});
                console.log(" not ok"+error)
            } else {
              for(let i=1;i<img.length;i++){
                let sql3="INSERT INTO image set ?"
                let details2 = {
                  refCentre:refCentre,
                  src:img[i],
                  couverture:0
              };
              connection.query(sql3,details2,(error) => {
                if(error){
                    res.send({ status: false, message: "Service created Failed"});
                    console.log(" not ok"+error)
                } else {
                  let sql4="INSERT INTO succursale set ?"
                  let details3 = {
                    refCentre:refCentre,
                    codeVille:req.body.ville,
                    adresse:req.body.adresse,
                    tel:req.body.tel,
                };
                connection.query(sql4,details3,(error) => {
                  if(error){
                      res.send({ status: false, message: "Service created Failed"});
                      console.log(" not ok"+error)
                  }else{
                    console.log("centre add1")
                  }
                })
                }})
              }
            }
          })
        }
    });
  });
  route.post("/newHeure/:reference",cors(),async(req,res)=>{
    let refCentre= req.params.reference
    let sql5="INSERT INTO heure (refCentre,refHoraire) values (?,?)"
                      
    connection.query(sql5,[refCentre,1],(error) => {
      if(error){
          res.send({ status: false, message: "Service created Failed"});
          console.log(" not ok"+error)
      } else {
        let sql5="INSERT INTO heure set ?"
      let details4 = {
        refCentre:refCentre,
        refHoraire:2,
    };
    connection.query(sql5,details4,(error) => {
      if(error){
          res.send({ status: false, message: "Service created Failed"});
          console.log(" not ok"+error)
      } else {
        let sql5="INSERT INTO heure set ?"
      let details4 = {
        refCentre:refCentre,
        refHoraire:3,
    };
    connection.query(sql5,details4,(error) => {
      if(error){
          res.send({ status: false, message: "Service created Failed"});
          console.log(" not ok"+error)
      } else {
        let sql5="INSERT INTO heure set ?"
      let details4 = {
        refCentre:refCentre,
        refHoraire:4,
    };
    connection.query(sql5,details4,(error) => {
      if(error){
          res.send({ status: false, message: "Service created Failed"});
          console.log(" not ok"+error)
      } else {
        let sql5="INSERT INTO heure set ?"
      let details4 = {
        refCentre:refCentre,
        refHoraire:5,
    };
    connection.query(sql5,details4,(error) => {
      if(error){
          res.send({ status: false, message: "Service created Failed"});
          console.log(" not ok"+error)
      } else {
        let sql5="INSERT INTO heure set ?"
      let details4 = {
        refCentre:refCentre,
        refHoraire:6,
    };
    connection.query(sql5,details4,(error) => {
      if(error){
          res.send({ status: false, message: "Service created Failed"});
          console.log(" not ok"+error)
      } else {
        let sql5="INSERT INTO heure set ?"
      let details4 = {
        refCentre:refCentre,
        refHoraire:7,
    };
    connection.query(sql5,details4,(error) => {
      if(error){
          res.send({ status: false, message: "Service created Failed"});
          console.log(" not ok"+error)
      } else {
        console.log("centre ajouter!!")
      }
    })
      }
    })
      }
    })
      }
    })
      }
    })
      }
    })
      }
    })
    
    })
module.exports = route;