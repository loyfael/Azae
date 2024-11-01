"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
/**
 * Importation du module dotenv pour gérer les variables d'environnement.
 * Le .env contient des données sensibles mais obligatoire au fonctionnement
 * du bot tel que son token.
 */
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // Charge les variables d'environnement depuis le fichier .env
// Importation des gestionnaires d'événements personnalisés
const ready_1 = require("./events/ready"); // Gestionnaire pour l'événement 'ready'
const interactionCreate_1 = require("./events/interactionCreate"); // Gestionnaire pour l'événement 'interactionCreate'
// Création d'une nouvelle instance de Client Discord avec les intents et partials nécessaires
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds, // Permet au bot d'accéder aux informations des serveurs (guilds)
        discord_js_1.GatewayIntentBits.GuildMessages // Permet au bot de recevoir les messages des salons de texte
    ],
    partials: [
        discord_js_1.Partials.Channel, // Permet au bot de gérer les salons partiels (par exemple, les salons DM)
        discord_js_1.Partials.Message // Permet au bot de gérer les messages partiels (par exemple, les messages non cachés au démarrage)
    ]
});
/**
 * Gestionnaire de l'événement 'ready'.
 *
 * Cet événement est émis lorsque le bot Discord est connecté et prêt à être utilisé.
 * Il appelle la fonction `handleReady` pour effectuer les initialisations nécessaires.
 */
client.once('ready', () => {
    (0, ready_1.handleReady)(client);
});
/**
 * Gestionnaire de l'événement 'interactionCreate'.
 *
 * Cet événement est émis chaque fois qu'une interaction est créée (par exemple, un clic sur un bouton, une sélection dans un menu, etc.).
 * Il appelle la fonction `handleInteractionCreate` pour traiter l'interaction en fonction de son type et de son contenu.
 */
client.on('interactionCreate', (interaction) => {
    (0, interactionCreate_1.handleInteractionCreate)(client, interaction);
});
/**
 * Connexion du bot à Discord en utilisant le token fourni dans les variables d'environnement.
 *
 * Assurez-vous que le fichier `.env` contient la variable `DISCORD_BOT_TOKEN` avec le token de votre bot.
 */
client.login(process.env.DISCORD_BOT_TOKEN);
