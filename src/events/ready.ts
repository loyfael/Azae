import { 
    Client, 
    TextChannel, 
    EmbedBuilder, 
    ActionRowBuilder, 
    StringSelectMenuBuilder 
} from 'discord.js';
import { createSelectMenu } from '../components/selectMenu'; // Function to create the category selection menu
import { CHANNEL_ID } from '../config/config'; // Constant containing the ID of the channel to send the menu message

/**
 * Function called when the Discord bot is ready and connected.
 * 
 * @param {Client} client - The Discord client.
 */
export async function handleReady(client: Client) {
    // Log to the console that the bot is connected, with its user tag
    console.log(`Connected as ${client.user?.tag}`);
    
    // Send the message with the selection menu in the specified channel
    await sendSelectMenuMessage(client);
}

/**
 * Sends a message containing an embed and a selection menu in a specific channel.
 * 
 * This message allows users to select a category to open a ticket.
 * 
 * @param {Client} client - The Discord client.
 */
async function sendSelectMenuMessage(client: Client) {
    try {
        // Fetch the Discord channel using the ID specified in the configuration
        const channel = await client.channels.fetch(CHANNEL_ID) as TextChannel;
        if (!channel) {
            // Log an error if the channel is not found
            console.error('Channel not found.');
            return;
        }

        // Create the selection menu using the custom function
        const selectMenu = createSelectMenu();

        // Create an action row and add the selection menu to it
        const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu);

        // Create the embed for the message
        const embed = new EmbedBuilder()
            .setDescription(`
                    # Bienvenue ! :wave::skin-tone-2:
                    ### :warning: Lors de l'ouverture d'un ticket, n'oubliez jamais les formes et la politesse. Les tickets ouverts sans seront automatiquement __fermés__.

                    :microphone2: **Partenariat**
                    Je suis créateur(trice) de contenu/membre d'une organisation, je souhaites nouer un partenariat.

                    :question: **Question / Aide**
                    Je souhaite poser une question. J'ai envie d'organiser un événement et j'ai besoin d'aide pour l'organiser.

                    :rage: **Plainte**
                    J'ai un problème avec un membre de BadLands et je souhaites le signaler.

                    :moneybag: **Remboursement**
                    Vous souhaitez être remboursé(e) d'items virtuels (si le problème est à cause d'un bug)

                    :bug: **Signalement de bug**
                    J'ai rencontré(e) un problème / un comportement anormal du serveur de jeu et souhaite le signaler.

                    :speaking_head: **Contestation de sanction**
                    J'ai été sanctionné(e) et conteste ma sanction.

                    :zap: **Intervention**
                    Tickets nécessitant l'intervention d'un opérateur (Unclaim d'un land, placer une affiche dans le Spawn..)
                `) // Detailed description of the embed with the different ticket categories
            .setColor("#fc7703"); // Sets the color of the embed (hexadecimal)

        // Send the message in the channel with the embed and the selection menu
        await channel.send({ 
            embeds: [embed], 
            components: [row] 
        });
        
        // Log to the console that the message was sent successfully
        console.log('Message with the selection menu sent successfully.');
    } catch (error) {
        // Handle and log potential errors when sending the message
        console.error('Error sending the message:', error);
    }
}
