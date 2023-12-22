# Remindr - Documentation Technique

## 1. Choix Technologiques

- **Langage Backend :** Node.js avec Express.js
- **ORM :** Prisma.js pour MySQL
- **Moteur de Template :** Handlebars
- **Middlewares :** Body-parser

## 2. Structure du Projet

- **Vues :** `/views` (contenant des fichiers pour chaque page, des vues partielles et des layouts)
- **Routes :** `/Routes` (modules distincts pour différentes fonctionnalités)
- **Contrôleurs :** `/Controllers` (regroupant les logiques métier)

## 3. Détails de Mise en Œuvre

### Fonctionnalités Principales

- **Authentification et Comptes Utilisateurs :**
  - `register`, `connexion` gérés par `Cregister`, `Cconnexion`.
- **Gestion des Groupes :**
  - `createGroupe`, `afficherRappelGroup`.
- **Création et Gestion des Rappels :**
  - `createRappel`, `deleteRappel`, `afficherModifierRappel`, `modifierRappel`.
- **Affichage sur le Tableau de Bord :**
  - Page `board` affichant les rappels à échéance et la liste des groupes.
- **Affichage des Rappels dans un Groupe :**
  - Route `/groupe/:id`.

