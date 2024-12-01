import { Client, GatewayIntentBits, Partials, ActivityType, EmbedBuilder } from 'discord.js';

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
        GatewayIntentBits.GuildMessages, // Permet au bot de recevoir les messages des salons de texte
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildPresences, // Intents pour presenceUpdate
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
            client.user.setActivity(`🟢 ${playerCount} joueur(euse)s`, { type: ActivityType.Watching });
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

    console.log("Status update")
    setInterval(updateBotStatus, 60000);
});

client.on('guildMemberAdd', (member) => {
    // Créer l'embed de bienvenue
    const embed = new EmbedBuilder()
        .setColor(0x00AAFF) // Couleur de l'embed
        .setTitle('Salut ! Bienvenue à toi sur BadLands. :wave:')
        .setDescription(`
            Je suis Azae, la mascotte des BadLands.

            **Adresse IP du serveur de jeu** : \`play.badlands.fr\` 
            (version 1.21.1 & joueurs crack acceptés !)

            **Tu cherches le site web ?** [badlands.fr](https://badlands.fr/)
            **Tu cherches la boutique ?** [badlands.fr/shop](https://badlands.fr/shop)
            **Tu cherches de l'aide ?** <#1079388622014398575>

            Bon jeu à toi !
        `)
        .setFooter({ text: 'Amuse-toi bien sur BadLands !' })
        // .setThumbnail('https://example.com/azae_thumbnail.png'); // URL vers une image de ta mascotte (optionnel)

    // Envoyer un message privé au membre
    member.send({ embeds: [embed] }).catch((err) => {
        console.error(`Impossible d'envoyer un DM à ${member.user.tag}.`);
        console.log(err);
    });
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
