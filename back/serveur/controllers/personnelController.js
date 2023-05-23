const personnel = require("../models/personnel");

module.exports = {
// Obtenir tous les personnels
getAllPersonnels  : (req, res) => {
  personnel.getAll(req.params.refCentre, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message ||
          "Une erreur est survenue lors de la récupération  des personnels.",
      })
    else  res.json( data);
  });
},

// Modifier un personnel existant
 updatePersonnel : (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Le contenu ne peut pas être vide!",
    });
  }

  personnel.update(
    req.params.CIN,
    new personnel(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Personnel non trouvé avec l'ID ${req.params.CIN}.`,
          });
        } else {
          res.status(500).send({
            message: "Erreur lors de la mise à jour du personnel avec l'ID " + req.params.CIN,
          });
        }
      } else res.send(data);
    }
  );
},

// Supprimer un personnel existant avec l'ID spécifié dans la demande
 deletePersonnel : (req, res) => {
  personnel.delete(req.params.CIN, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Personnel non trouvé avec l'ID ${req.params.CIN}.`,
        });
      } else {
        res.status(500).send({
          message: "Impossible de supprimer le personnel avec l'ID " + req.params.CIN,
        });
      }
    } else res.send({ message: "Personnel supprimé avec succès!" });
  });
},

// Obtenir le nombre de personnels pour un centre spécifique
 getNbPersonnelsByCentre : (req, res) => {
  personnel.getNbPersonnelsByCentre(req.params.refCentre, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message ||
          "Une erreur est survenue lors de la récupération du nombre de personnels.",
      })
    else  res.json( data);
  });
},

// Obtenir un personnel par son CIN
 getOnePersonnelByRef : (req,res) => {
   personnel.getOnePersonnelByRef(req.params.CIN, (err, data) => {
    if (err) {
       if (err.kind === "not_found") {
           res.status(404).send({ message: `Personnel non trouvé avec la référence ${req.params.ref}.` });
      } 
       else {
            res.status(500).send({
            message: err.message || "Une erreur est survenue lors de la récupération du personnel.",
        });
      }
    } else res.json( data);
  });
 },

 searchPersonnel : (req, res) => {
    const searchValue = req.params.value;
    personnel.search(searchValue, (err, personnels) => {
      if (err) {
        res.status(500).send({
          message:
            err.message || "Some error occurred while searching for personnels.",
        });
      } else {
        res.send(personnels);
      }
    });
  }
,
 verifyPersonnel : (req, res) => {
  const activeCode = req.params.activeCode;

  personnel.verify(activeCode, { isActive: 1 }, (err, data) => {
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