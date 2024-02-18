// Importation du client Prisma permettant d'interagir avec la base de données
const { PrismaClient } = require('@prisma/client');

// Initialisation d'une instance du client Prisma
const prisma = new PrismaClient();

// Fonction asynchrone pour afficher les rappels d'un groupe spécifique
async function afficherRappelGroup(req, res) {
    // Récupération du nom du groupe depuis les paramètres de la requête HTTP
    const groupName = req.params.id;

    // Recherche du groupe spécifique dans la base de données avec les utilisateurs et les rappels associés
    const groups = await prisma.groups.findUnique({
        where: { nomGroup: groupName },
        include: {
            users: true,
            rappels: true
        }
    });

    // Affichage des informations du groupe dans la console
    console.log(groups);

    // Vérification de l'existence du groupe
    if (groups !== undefined) {
        // Initialisation d'une variable indiquant si l'utilisateur fait partie du groupe
        var isInGroup = false;

        // Parcourir les utilisateurs du groupe pour vérifier la présence de l'utilisateur actuel
        for (let i = 0; i < groups.users.length; i++) {
            if (groups.users[i].name == req.session.user.user) {
                // Utilisateur trouvé dans le groupe
                isInGroup = true;

                try {
                    // Recherche détaillée du groupe avec les utilisateurs et les rappels triés par date d'échéance
                    const group = await prisma.groups.findUnique({
                        where: { nomGroup: groupName },
                        include: {
                            users: true,
                            rappels: {
                                orderBy: [
                                    { dateEcheance: 'asc' },
                                ],
                            },
                        },
                    });

                    if (group) {
                        // Vérification si l'utilisateur fait partie du groupe
                        const isInGroup = group.users.some((user) => user.name === req.session.user.user);

                        if (isInGroup) {
                            // Formatage des rappels pour affichage dans la page
                            const rappelsHTML = group.rappels.map((rappel) => {
                                return `
                                    <li class="group-item">
                                        <h3 style="color: ${rappel.couleur}; font-weight: bold; font-size: 16px;">
                                            ${rappel.nom}
                                        </h3>
                                        <p>Description: ${rappel.description}</p>
                                        <p>Date d'échéance: ${rappel.dateEcheance.toISOString().split('T')[0]}</p>
                                        <p>Heure d'échéance: ${rappel.dateEcheance.toTimeString().split(' ')[0]}</p>
                                        <form action="modifRappel" method="post">
                                            <input type="hidden" name="idRappel" value="${rappel.id}">
                                            <button type="submit" class="modifier-btn">Modifier</button>
                                        </form>
                                        <form action="deleteRappel" method="post">
                                            <input type="hidden" name="idRappel" value="${rappel.id}">
                                            <button type="submit" class="supprimer-btn">Supprimer</button>
                                        </form>
                                    </li>
                                `;
                            });

                            // Ajout du groupe à la session dans une variable "groupe"
                            req.session.group = { gourpi: groups.id, groupname: groups.nomGroup };
                            // Rendu de la vue 'rappel' avec les rappels du groupe pour affichage
                            res.render("rappel", { rappels: rappelsHTML, groupName: groupName, username: req.session.user.user });
                        }
                    }
                } catch (error) {
                    console.error('Erreur lors de la récupération des données du groupe :', error);
                    res.status(500).send('Erreur interne du serveur');
                }
            }
        }
    }
}

// Exportation de la fonction afficherRappelGroup pour être utilisée dans d'autres fichiers
module.exports = afficherRappelGroup;
