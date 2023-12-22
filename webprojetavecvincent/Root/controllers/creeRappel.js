// Importation du client Prisma permettant d'interagir avec la base de données
const { PrismaClient } = require('@prisma/client');

// Initialisation d'une instance du client Prisma
const prisma = new PrismaClient();

// Fonction asynchrone pour créer un nouveau rappel
async function creerappel(req, res) {
    try {
        // Création d'un nouveau rappel avec les informations fournies dans la requête HTTP
        console.log(req.body.date, req.body.time, req.body.reminderColor);
        const date = req.body.date.split('-');
        const time = req.body.time.split(':');
        console.log(date, time);

        const newRappel = await prisma.rappel.create({
            data: {
                nom: req.body.name,
                description: req.body.bio,
                dateEcheance: new Date(date[0], parseInt(date[1]) - 1, date[2], time[0], time[1]),
                couleur: req.body.reminderColor,
                groupId: req.session.group.gourpi, // Récupération du groupe à partir de la session
            }
        });

        console.log('Rappel créé avec succès.');
    } catch (error) {
        // Gestion des erreurs en cas de problème lors de la création du rappel
        console.error('Erreur lors de la création du rappel :', error);
    }

    // Redirection vers la page du groupe associé au rappel nouvellement créé
    const redirect = '/groupe/' + req.session.group.groupname;
    console.log("Redirection vers :", redirect);
    res.redirect(redirect);
}

// Exportation de la fonction creerappel pour être utilisée dans d'autres fichiers
module.exports = creerappel;
