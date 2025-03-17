import { 
    SlashCommandBuilder, 
    ChatInputCommandInteraction, 
    TextChannel, 
} from 'discord.js';

// Import role's ID and category's ID from config file
import { STAFF_ROLE_ID, CATEGORY_ID } from '../config/config'; // IDs du rôle du staff et de la catégorie des tickets

/**
 * Define /ticket add command.
 * 
 * This command allows staff members to add users to a specific ticket channel.
 */
export const data = new SlashCommandBuilder()
    .setName('ticket') // Nom de la commande principale
    .setDescription('Gestion des tickets') // Description de la commande principale
    .addSubcommand(subcommand => 
        subcommand
            .setName('add') // Nom du sous-commande
            .setDescription('Ajouter un utilisateur à un ticket') // Description du sous-commande
            .addUserOption(option => 
                option.setName('utilisateur') // Nom de l'option
                      .setDescription('L\'utilisateur à ajouter') // Description de l'option
                      .setRequired(true) // Option requise
            )
    );

/**
 * Execute`/ticket add` command.
 * 
 * This function allows staff members to add users to a specific ticket channel.
 * 
 * @param {ChatInputCommandInteraction} interaction - The interaction object.
 */
export async function execute(interaction: ChatInputCommandInteraction) {
    // Verify if the interaction is a command
    if (!interaction.isChatInputCommand()) return;

    // Get the subcommand used by the user
    const subcommand = interaction.options.getSubcommand();

    // Process the subcommand
    if (subcommand === 'add') {
        // Get the channel where the interaction took place
        const channel = interaction.channel as TextChannel;

        // Verify if the interaction took place in a ticket channel
        if (!channel || !channel.parentId || channel.parentId !== CATEGORY_ID) {
            await interaction.reply({ 
                content: 'Cette commande ne peut être utilisée que dans un canal de ticket.', 
                ephemeral: true // Visible message only to the user
            });
            return;
        }

        // Get the member who used the command
        const member = interaction.member;

        // Verify if the member is a staff member
        if (!member || !(member.roles as any).cache.has(STAFF_ROLE_ID)) {
            await interaction.reply({ 
                content: 'Vous n\'avez pas la permission d\'utiliser cette commande.', 
                ephemeral: true 
            });
            return;
        }

        // Get the user to add to the ticket
        const user = interaction.options.getUser('utilisateur', true);

        // Get the guild where the interaction took place
        const guild = interaction.guild;

        // Verify if the guild exists
        if (!guild) {
            await interaction.reply({ 
                content: 'Impossible d\'ajouter un utilisateur en dehors d\'un serveur.', 
                ephemeral: true 
            });
            return;
        }

        // Get the member to add to the ticket
        const memberToAdd = guild.members.cache.get(user.id);

        // Verifyt if the member exists
        if (!memberToAdd) {
            await interaction.reply({ 
                content: 'Utilisateur non trouvé dans le serveur.', 
                ephemeral: true 
            });
            return;
        }

        try {
            // Add the user to the ticket channel
            await channel.permissionOverwrites.create(user.id, {
                ViewChannel: true, // Permit the user to view the channel
                SendMessages: true, // Permit the user to send messages
                ReadMessageHistory: true, // Permit the user to read the message history
            });

            // Answer to the user that the user has been added to the ticket
            await interaction.reply({ 
                content: `${user} a été ajouté au ticket.`, 
                ephemeral: false // Message visible par tous les membres du canal
            });
        } catch (error) {
            // Log the error in the console
            console.error('Erreur lors de l\'ajout de l\'utilisateur au ticket :', error);

            // Answer to the user that an error occurred
            await interaction.reply({ 
                content: 'Une erreur est survenue lors de l\'ajout de l\'utilisateur au ticket.', 
                ephemeral: true 
            });
        }
    }
}
