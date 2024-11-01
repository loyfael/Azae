// src/deploy-commands.ts

// Importation des classes nécessaires depuis discord.js
import { REST, Routes } from 'discord.js';

// Importation des données des commandes personnalisées
import { data as ticketAddCommand } from './commands/ticketAdd'; // Exemple de commande personnalisée

// Importation du module dotenv pour gérer les variables d'environnement
import dotenv from 'dotenv';
dotenv.config(); // Charge les variables d'environnement depuis le fichier .env

// Importation des constantes de configuration personnalisées
import { CLIENT_ID, GUILD_ID } from './config/config'; // IDs du client et du serveur (guild)

/**
 * Tableau contenant toutes les commandes à déployer.
 * 
 * Chaque commande doit être exportée avec une propriété `data` contenant la définition de la commande.
 * La méthode `toJSON()` convertit la commande en un format compatible avec l'API Discord.
 */
const commands = [
    ticketAddCommand.toJSON(),
    // Ajoutez ici d'autres commandes si nécessaire, par exemple :
    // anotherCommand.toJSON(),
];

/**
 * Instance de REST pour interagir avec l'API Discord.
 * 
 * - `version: '10'` : Spécifie la version de l'API Discord à utiliser.
 * - `.setToken(...)` : Définit le token du bot pour authentifier les requêtes.
 */
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN!);

/**
 * Fonction auto-invoquée pour déployer les commandes sur un serveur Discord spécifique.
 * 
 * Utilise les routes de l'API Discord pour enregistrer les commandes au niveau du serveur (guild).
 * Cela permet un rafraîchissement rapide des commandes sans délai de propagation.
 */
(async () => {
    try {
        console.log('Rafraîchissement des commandes en cours..');

        /**
         * Requête PUT à l'API Discord pour mettre à jour les commandes d'application dans une guilde spécifique.
         * 
         * - `Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID)` : Spécifie l'URL de l'API pour déployer les commandes au niveau de la guilde.
         * - `{ body: commands }` : Envoie le tableau des commandes formatées dans le corps de la requête.
         */
        await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
            { body: commands },
        );

        console.log('Les commandes ont été rafraîchies avec succès.');
    } catch (error) {
        /**
         * Gestion des erreurs lors du déploiement des commandes.
         * 
         * - Log des erreurs pour le dépannage.
         */
        console.log(`Les commandes n'ont pas pu être rafraîchies. Erreur ci-dessous:`);
        console.error(error);
    }
})();
