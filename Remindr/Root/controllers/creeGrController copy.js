const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function cgroup(req,res) {
    const name = req.body.groupName;
    const userIdsToAdd = req.body.members.split(',');
    try {
        // Créer un nouveau groupe
        const newGroup = await prisma.groups.create({
        data: {
            nomGroup: name
        }
        });

        // Liste des IDs des utilisateurs à ajouter au groupe

        // Associer les utilisateurs au groupe créé
        for( let i = 0; i< userIdsToAdd.length;i++){
        const user = await prisma.users.findUnique({
        
            where: {
            name: userIdsToAdd[i]
            }
        });
        if(user != null){
            await prisma.groupUsers.create({
            data: {
                userId: user.id ,
                groupId: newGroup.id
            }
            });
            console.log("User added to the group");
        }else{

            console.log("User is not found : ");
        }
        };

        // Attendre que toutes les associations soient créées
        //await Promise.all(groupUsers);

        console.log('Groupe créé avec les utilisateurs associés avec succès.');
        res.redirect('/board');
    } catch (error) {
        console.error('Erreur lors de la création du groupe :', error);
    }
}
module.exports = cgroup;