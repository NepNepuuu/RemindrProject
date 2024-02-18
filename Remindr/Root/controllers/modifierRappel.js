// Importation du client Prisma permettant d'interagir avec la base de données
const { PrismaClient } = require('@prisma/client');

// Initialisation d'une instance du client Prisma
const prisma = new PrismaClient();

// Fonction asynchrone pour modifier un rappel existant
async function modifierRappel(req, res) {
  try {
    // Récupération des informations du formulaire de modification du rappel
    const date = req.body.date.split('-');
    const time = req.body.time.split(':');

    // Mise à jour du rappel dans la base de données
    const rappel = await prisma.rappel.update({
      where: {
        id: parseInt(req.body.idRappel)
      },
      data: {
        nom: req.body.name,
        description: req.body.bio,
        dateEcheance: new Date(date[0], parseInt(date[1]) - 1, date[2], time[0], time[1]),
        couleur: req.body.color,
      }
    });

    console.log('Rappel modifié avec succès.');
  } catch (error) {
    // Gestion des erreurs en cas de problème lors de la modification du rappel
    console.error('Erreur lors de la modification du rappel :', error);
  }

  // Redirection vers la page du groupe associé au rappel modifié
  const redirect = '/groupe/' + req.session.group.groupname;
  console.log("Redirection vers :", redirect);
  res.redirect(redirect);
}

// Exportation de la fonction modifierRappel pour être utilisée dans d'autres fichiers
module.exports = modifierRappel;
