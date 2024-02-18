// Importation du client Prisma permettant d'interagir avec la base de données
const { PrismaClient } = require('@prisma/client');

// Initialisation d'une instance du client Prisma
const prisma = new PrismaClient();

// Fonction asynchrone pour afficher le tableau de bord de l'utilisateur
async function affichertableaubord(req, res) {
    try {
        // Récupération des données de l'utilisateur, y compris les groupes et les rappels associés
        const user = await prisma.users.findUnique({
            where: { name: req.session.user.user },
            include: {
                groups: {
                    include: {
                        users: true,
                        rappels: {
                            orderBy: [
                                { dateEcheance: 'asc' },
                            ],
                        }
                    }
                }
            }
        });

        // Concaténation de tous les rappels de tous les groupes de l'utilisateur
        const userGroupsRappels = user.groups.map(groupUser => groupUser.rappels);
        const allRappels = userGroupsRappels.reduce((acc, rappels) => acc.concat(rappels), []);

        // Tri des rappels par date d'échéance
        sortedRappels = allRappels.sort((a, b) => {
            const dateComparison = new Date(a.dateEcheance) - new Date(b.dateEcheance);
            return dateComparison;
        });

        // Filtrage des rappels dépassés
        const rappelsDepasses = sortedRappels.filter(rappel => new Date(rappel.dateEcheance) < new Date());

        // Sélection des trois prochains rappels non dépassés
        const troisProchainsRappels = sortedRappels
            .filter(rappel => new Date(rappel.dateEcheance) >= new Date())
            .slice(0, 3);

        // Construction de la liste des groupes avec leurs membres
        const userGroupsName = user.groups.map(groupUser => groupUser.nomGroup);
        const userGroupsMembers = user.groups.map(groupUser => groupUser.users);
        str = "";
        for (i = 0; i < userGroupsName.length; i++) {
            str += '<li class="group-item"><h3><a href="/groupe/' + userGroupsName[i] + '">' + userGroupsName[i] + "</a></h3><p>Membres : ";
            for (j = 0; j < userGroupsMembers[i].length; j++) {
                str += userGroupsMembers[i][j].name
                if (j < userGroupsMembers[i].length - 1) {
                    str += ", "
                }
            }
            str += "</p></li>"
        }

        // Construction de la liste des trois prochains rappels urgents au format HTML
        let troisProchainsRappelsHTML = '<li class="group-item"><h3>Trois prochains rappels urgents</h3><ul>';
        for (const rappel of troisProchainsRappels) {
            troisProchainsRappelsHTML += '<li>';
            troisProchainsRappelsHTML += '<h4 style="font-weight: bold; font-size: larger; color: ' + rappel.couleur + ';">' + rappel.nom + '</h4>';
            troisProchainsRappelsHTML += 'Description: ' + rappel.description + '<br>';
            troisProchainsRappelsHTML += 'Date d\'échéance: ' + rappel.dateEcheance.toLocaleDateString() + '<br>';
            troisProchainsRappelsHTML += 'Heure d\'échéance: ' + rappel.dateEcheance.toLocaleTimeString() + '<br>';
            troisProchainsRappelsHTML += '</li>';
        }
        troisProchainsRappelsHTML += '</ul></li>';

        // Construction de la liste des rappels dépassés au format HTML
        let rappelsDepassesHTML = '<li class="group-item"><h3>Rappels dépassés</h3><ul>';
        for (const rappel of rappelsDepasses) {
            rappelsDepassesHTML += '<li style="font-style: italic;">';
            rappelsDepassesHTML += '<h4 style="font-weight: bold; font-size: larger; color: ' + rappel.couleur + ';">' + rappel.nom + '</h4>';
            rappelsDepassesHTML += 'Description: ' + rappel.description + '<br>';
            rappelsDepassesHTML += 'Date d\'échéance: ' + rappel.dateEcheance.toLocaleDateString() + '<br>';
            rappelsDepassesHTML += 'Heure d\'échéance: ' + rappel.dateEcheance.toLocaleTimeString() + '<br>';
            rappelsDepassesHTML += '</li>';
        }
        rappelsDepassesHTML += '</ul></li>';

        // Rendu de la vue 'board' avec les informations à afficher
        res.render('board', {
            groups: str,
            troisProchainsRappels: troisProchainsRappelsHTML,
            rappelsDepasses: rappelsDepassesHTML,
            username: req.session.user.user
        });
    } catch (error) {
        // Gestion des erreurs en cas de problème lors de la récupération des données
        console.error('Erreur lors de la récupération des données :', error);
        res.status(500).send('Erreur interne du serveur');
    }
}

// Exportation de la fonction affichertableaubord pour être utilisée dans d'autres fichiers
module.exports = affichertableaubord;
