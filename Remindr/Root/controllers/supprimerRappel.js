// Importation du client Prisma permettant d'interagir avec la base de données
const { PrismaClient } = require('@prisma/client');

// Initialisation d'une instance du client Prisma
const prisma = new PrismaClient();

// Fonction asynchrone pour supprimer un rappel existant
async function delRappel(req, res) {
    try {
        // Récupération de l'identifiant du rappel à supprimer depuis le corps de la requête
        const idRappel = req.body.idRappel;

        // Suppression du rappel dans la base de données
        const deleteRappel = await prisma.rappel.delete({
            where: {
                id: parseInt(idRappel),
            },
        });

        console.log('Rappel supprimé avec succès.');
    } catch (error) {
        // Gestion des erreurs en cas de problème lors de la suppression du rappel
        console.error('Erreur lors de la suppression du rappel :', error);
    }

    // Redirection vers la page du groupe associé au rappel supprimé
    const redirect = '/groupe/' + req.session.group.groupname;
    console.log("Redirection vers :", redirect);
    res.redirect(redirect);
}

// Exportation de la fonction delRappel pour être utilisée dans d'autres fichiers
module.exports = delRappel;
