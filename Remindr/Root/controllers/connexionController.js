// registerController.js
const { resolve } = require('path');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

// Initialisation d'une instance du client Prisma
const prisma = new PrismaClient();

// Nombre de tours de salage pour le hachage du mot de passe
const saltRounds = 10;

// Fonction asynchrone pour gérer la connexion d'un utilisateur
async function cconnexion(req, res) {
    // Récupération du mot de passe et de l'email depuis le corps de la requête HTTP
    const password = req.body.mdp;
    const email = req.body.email;

    // Recherche de l'utilisateur dans la base de données en utilisant l'email fourni
    const user = await prisma.users.findUnique({
        where: {
            email: email,
        }
    });

    // Affichage des informations de l'utilisateur dans la console
    console.log(user);

    // Vérification si l'utilisateur existe dans la base de données
    if (user != null) {
        // Comparaison du mot de passe fourni avec le hash stocké dans la base de données
        await bcrypt.compare(password, user.mpd, (err, result) => {
            if (err) {
                // Gérer l'erreur ici
                console.error(err);
                return;
            }

            if (result) {
                // Le mot de passe correspond au hash stocké
                console.log('Le mot de passe est valide.');
                // Définition de la session utilisateur avec le nom d'utilisateur et l'email
                req.session.user = { user: user.name, email: email };
                console.log(req.session.user);
                // Redirection vers la page du tableau de bord
                res.redirect('/board');
            } else {
                // Le mot de passe ne correspond pas au hash stocké
                console.log('Le mot de passe est incorrect.');
            }
        });
    }
}

// Exportation de la fonction cconnexion pour être utilisée dans d'autres fichiers
module.exports = cconnexion;
