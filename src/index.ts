import { Client, GatewayIntentBits, Partials, ActivityType, EmbedBuilder } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config(); 
import { handleReady } from './events/ready';
import { handleInteractionCreate } from './events/interactionCreate';
import { getMinecraftPlayerCount } from './utils/minecraftStatus';

// Create a new Discord client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildPresences,
    ],
    partials: [
        Partials.Channel,
        Partials.Message
    ]
});

/**
 * Function to update the bot's status based on the number of players on the Minecraft server.
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
 * Event manager for the 'ready' event.
 * 
 * This event is emitted once the bot is ready and connected to Discord.
 */
client.once('ready', async () => {
    handleReady(client);
    await updateBotStatus(); // Update bot status immediately after connecting

    console.log("Status update")
    setInterval(updateBotStatus, 60000);
});

// Send a welcome message to new members when they join the server
client.on('guildMemberAdd', (member) => {
    // Create a new embed with a welcome message
    const embed = new EmbedBuilder()
        .setColor(0x00AAFF) // Embed color (light blue)
        .setTitle('Salut ! Bienvenue à toi sur le serveur ! :wave:')
        .setDescription(`
            Je suis Azae.
                
            Lorem ipsum dolor sit amet
        `)
        .setFooter({ text: 'Amuse-toi bien !' })
        // .setThumbnail('https://example.com/azae_thumbnail.png'); // Add a thumbnail image if needed

    // Send the embed as a direct message to the new member
    member.send({ embeds: [embed] }).catch((err) => {
        console.error(`Impossible d'envoyer un DM à ${member.user.tag}.`);
        console.log(err);
    });
});

/**
 * Event manager for the 'interactionCreate' event.
 * 
 * This event is emitted whenever an interaction is created, such as a slash command or button click.
 */
client.on('interactionCreate', (interaction) => {
    handleInteractionCreate(client, interaction);
});

/**
 * Log in to Discord using the bot token.
 * 
 * The bot token is stored in the `.env` file and loaded using the `dotenv` module.
 */
client.login(process.env.DISCORD_BOT_TOKEN);
