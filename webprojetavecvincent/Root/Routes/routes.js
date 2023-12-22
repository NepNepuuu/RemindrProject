const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { resolve } = require('path');
const bodyParser = require('body-parser');
const Cregister = require('../controllers/registerController');
const Cconnexion = require('../controllers/connexionController');
const Cgroup = require('../controllers/creeGrController');
const creationaffichegroup = require('../controllers/creationaffichegroup');
const affichertableaubord = require('../controllers/afficherTableauBord');
const creerappel = require('../controllers/creeRappel');
const afficherRappelGroup = require('../controllers/afficherRappelGroup');
const delRappel = require('../controllers/supprimerRappel');
const afficherModifierRappel = require('../controllers/afficherModiferRappel');
const modifierRappel = require('../controllers/modifierRappel');


const router = express.Router();
const prisma = new PrismaClient();

router.get('/deconnexion',(req, res) => { //page d'enregistrement
  req.session.destroy((err) => {
    if (err) {
      console.error('Erreur lors de la suppression de la session :', err);
    } else {
      res.redirect('/connexion')
    }
  });
});

router.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, '../views/connexion.html'));
});

router.post("/groupe/createGroupe", creationaffichegroup);

router.post('/register/getRegister', Cregister);

router.post('/connexion/getConnexion', Cconnexion);

router.post('/groupe/createGroupe', Cgroup);

router.get('/register', (req, res) => {
  res.sendFile(resolve(__dirname, '../views/register.html'));
});

router.get('/board', affichertableaubord);

router.post('/groupe/createRappel', creerappel)

router.get('/groupe/:id', afficherRappelGroup);

router.get('/connexion', (req, res) => {
  res.sendFile(resolve(__dirname, '../views/connexion.html'));
});

router.get('/groupe', (req, res) => {
  res.render('groupe',{
    username:req.session.user.user
  });
});

router.post('/groupe/deleteRappel', delRappel);

router.post('/groupe/modifRappel',afficherModifierRappel);

router.post('/groupe/rappelModifier', modifierRappel);

module.exports = router;
