// registerController.js
const { resolve } = require('path');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const saltRounds = 10;

async function cregister(req,res) {
  var password;
    console.log(req.body.mdp,"MOT DE PPASSdosdg")
    var email = req.body.email;
    const isAvailable = await prisma.users.findUnique({
      
      where: {
        email: email,
      }
    });
    if(isAvailable == null){
      bcrypt.hash(req.body.mdp, saltRounds, async (err, hash) => {
        if (err) {
          // Gérer l'erreur ici
          console.error(err);
          res.sendFile(resolve(__dirname, 'view/connexion.html'));
        }
        // Enregistrer le hash dans votre base de données, par exemple.
        password = hash;
        console.log(password,'HAAAAAAAAAAAAAAASH')
        const user = await prisma.users.create({
          data: {
            email : req.body.email,
            name : req.body.name,
            mpd : password
          }
        })
        res.redirect('/')
      });
    }
    console.log(password);
    
}

module.exports = cregister;
