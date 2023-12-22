// Importation du client Prisma permettant d'interagir avec la base de données
const { PrismaClient } = require('@prisma/client');

// Initialisation d'une instance du client Prisma
const prisma = new PrismaClient();

// Fonction asynchrone pour afficher et modifier un rappel
async function afficherModifierRappel(req, res) {
    // Récupération de l'identifiant du rappel depuis la requête HTTP
    const idRappel = req.body.idRappel;

    // Recherche du rappel correspondant dans la base de données à l'aide de Prisma
    const rappel = await prisma.rappel.findUnique({
        where: { id: parseInt(idRappel) }
    });

    // Extraction de la date et de l'heure du rappel pour affichage
    const dateR = rappel.dateEcheance.toISOString().split('T')[0];
    const timeR = rappel.dateEcheance.toTimeString().split(' ')[0];

    // Affichage des informations du rappel dans la console
    console.log(dateR, timeR, rappel.couleur);

    // Rendu de la vue 'rappelModifier' avec les informations du rappel pour modification
    res.render('rappelModifier', {
        name: rappel.nom,
        bio: rappel.description,
        date: dateR,
        time: timeR,
        color: rappel.couleur,
        id: idRappel.toString()
    });
}

// Exportation de la fonction afficherModifierRappel pour être utilisée dans d'autres fichiers
module.exports = afficherModifierRappel;
