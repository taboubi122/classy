
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendConfirmationEmail } = require('../confirmerEmail');
const client = require('../models/client');

module.exports = {
  getAllClients: (req, res) => {
    client.getAll((err, clients) => {
      if (err) {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving clients.",
        });
      } else {
        res.send(clients);
      }
    });
  },
 
  insertClient : (req, res) => {
    const { email, tel, password, nom, prenom } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const token = jwt.sign({ email }, "sECRTkeyS");
    const isActive=0;
    const activeCode = token;
    console.log(token)
    const newClient = new client({ email, tel, password: hashedPassword, nom, prenom, activeCode,isActive });
  
    client.insert(newClient, (err, client) => {
      if (err) {
        res.status(500).send({
          message: err.message || "Une erreur s'est produite lors de la création du client."
        });
      } else {
        res.status(201).send({ client, token });
        sendConfirmationEmail(email, activeCode);
      }
    });
  },
  
  deleteClient: (req, res) => {
    const CIN = req.params.CIN;
    client.delete(CIN, (err, result) => {
      if (err) {
        res.status(500).send({
          message:
            err.message || "Some error occurred while deleting the client.",
        });
      } else {
        res.send(result);
      }
    });
  },
  getClientbyCIN: (req, res) => {
    const CIN = req.params.CIN;
    client.findByCIN(CIN, (err, client) => {
      if (err) {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving the client.",
        });
      } else {
        res.send(client);
      }
    });
  },
  searchClients: (req, res) => {
    const searchValue = req.params.value;
    client.search(searchValue, (err, clients) => {
      if (err) {
        res.status(500).send({
          message:
            err.message || "Some error occurred while searching for clients.",
        });
      } else {
        res.send(clients);
      }
    });
  },

verifyUser : (req, res) => {
  const activeCode = req.params.activeCode;

  client.update(activeCode, { isActive: 1 }, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(404).json({
          message: `Utilisateur avec le code d'activation ${activeCode} non trouvé.`
        });
      } else {
        return res.status(500).json({
          message: "Erreur lors de la vérification de l'utilisateur."
        });
      }
    }

    res.json({data, message: "Utilisateur vérifié avec succès." });

})}


}