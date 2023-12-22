// registerController.js
const { resolve } = require('path');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

// Initialisation d'une instance du client Prisma
const prisma = new PrismaClient();

// Nombre de tours de salage pour le hachage du mot de passe
const saltRounds = 10;

// Fonction asynchrone pour créer et afficher un nouveau groupe
async function creationaffichegroup(req, res) {
    // Récupération du nom du groupe et des membres depuis le corps de la requête HTTP
    const name = req.body.groupName;
    const userIdsToAdd = req.body.members.split(',').map((item) => {
        return {
            name: item
        }
    });

    try {
        // Création d'un nouveau groupe avec les utilisateurs associés
        const newGroup = await prisma.groups.create({
            data: {
                nomGroup: name,
                users: {
                    connect: userIdsToAdd
                }
            }
        });

        // Affichage dans la console du succès de la création du groupe avec les utilisateurs associés
        console.log('Groupe créé avec les utilisateurs associés avec succès.');
        
        // Redirection vers la page du tableau de bord
        res.redirect('/board');
    } catch (error) {
        // Gestion des erreurs en cas de problème lors de la création du groupe
        console.error('Erreur lors de la création du groupe :', error);
    }
}

// Exportation de la fonction creationaffichegroup pour être utilisée dans d'autres fichiers
module.exports = creationaffichegroup;
