// src/index.ts

import { Client, GatewayIntentBits, Partials, ActivityType } from 'discord.js';

/** 
 * Importation du module dotenv pour gérer les variables d'environnement.
 * Le .env contient des données sensibles mais obligatoire au fonctionnement
 * du bot tel que son token.
 */ 
import dotenv from 'dotenv';
dotenv.config(); // Charge les variables d'environnement depuis le fichier .env

// Importation des gestionnaires d'événements personnalisés
import { handleReady } from './events/ready'; // Gestionnaire pour l'événement 'ready'
import { handleInteractionCreate } from './events/interactionCreate'; // Gestionnaire pour l'événement 'interactionCreate'

// Importation de la fonction pour récupérer le nombre de joueurs Minecraft
import { getMinecraftPlayerCount } from './utils/minecraftStatus';

// Création d'une nouvelle instance de Client Discord avec les intents et partials nécessaires
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, // Permet au bot d'accéder aux informations des serveurs (guilds)
        GatewayIntentBits.GuildMessages // Permet au bot de recevoir les messages des salons de texte
    ],
    partials: [
        Partials.Channel, // Permet au bot de gérer les salons partiels (par exemple, les salons DM)
        Partials.Message // Permet au bot de gérer les messages partiels (par exemple, les messages non cachés au démarrage)
    ]
});

/**
 * Fonction pour mettre à jour le statut du bot avec le nombre de joueurs Minecraft.
 */
async function updateBotStatus() {
    const playerCount = await getMinecraftPlayerCount();
    if (client.user) {
        if (playerCount > 0) {
            client.user.setActivity(`${playerCount} joueur(euse)s`, { type: ActivityType.Watching });
        } else {
            client.user.setActivity(`*Boup bip*`, { type: ActivityType.Playing });
        }
    }
}

/**
 * Gestionnaire de l'événement 'ready'.
 * 
 * Cet événement est émis lorsque le bot Discord est connecté et prêt à être utilisé.
 * Il appelle la fonction `handleReady` pour effectuer les initialisations nécessaires.
 * Il met également à jour le statut du bot et configure la mise à jour périodique.
 */
client.once('ready', async () => {
    handleReady(client);
    await updateBotStatus(); // Mettre à jour le statut au démarrage

    // Mettre à jour le statut toutes les 5 minutes (300000 ms)
    setInterval(updateBotStatus, 60000);
});

/**
 * Gestionnaire de l'événement 'interactionCreate'.
 * 
 * Cet événement est émis chaque fois qu'une interaction est créée (par exemple, un clic sur un bouton, une sélection dans un menu, etc.).
 * Il appelle la fonction `handleInteractionCreate` pour traiter l'interaction en fonction de son type et de son contenu.
 */
client.on('interactionCreate', (interaction) => {
    handleInteractionCreate(client, interaction);
});

/**
 * Connexion du bot à Discord en utilisant le token fourni dans les variables d'environnement.
 * 
 * Assurez-vous que le fichier `.env` contient la variable `DISCORD_BOT_TOKEN` avec le token de votre bot.
 */
client.login(process.env.DISCORD_BOT_TOKEN);
