import { 
    SlashCommandBuilder, 
    ChatInputCommandInteraction, 
    TextChannel, 
} from 'discord.js';

// Importation des constantes de configuration personnalisées
import { STAFF_ROLE_ID, CATEGORY_ID } from '../config/config'; // IDs du rôle du staff et de la catégorie des tickets

/**
 * Définition de la commande slash `/ticket add`.
 * 
 * Cette commande permet aux membres du staff d'ajouter un utilisateur à un canal de ticket existant.
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
 * Exécute la commande `/ticket add`.
 * 
 * Cette fonction gère l'ajout d'un utilisateur à un canal de ticket spécifique en ajustant les permissions du canal.
 * 
 * @param {ChatInputCommandInteraction} interaction - L'interaction de commande chat input.
 */
export async function execute(interaction: ChatInputCommandInteraction) {
    // Vérifie si l'interaction est bien une commande de type ChatInput
    if (!interaction.isChatInputCommand()) return;

    // Récupère le sous-commande utilisé
    const subcommand = interaction.options.getSubcommand();

    // Traite le sous-commande 'add'
    if (subcommand === 'add') {
        // Récupère le canal où la commande a été utilisée et le cast en TextChannel
        const channel = interaction.channel as TextChannel;

        // Vérifie si le canal existe, s'il a un parent, et si le parent correspond à la catégorie des tickets
        if (!channel || !channel.parentId || channel.parentId !== CATEGORY_ID) {
            await interaction.reply({ 
                content: 'Cette commande ne peut être utilisée que dans un canal de ticket.', 
                ephemeral: true // Message visible uniquement à l'utilisateur ayant exécuté la commande
            });
            return;
        }

        // Récupère les informations du membre qui a exécuté la commande
        const member = interaction.member;

        // Vérifie si le membre existe et s'il possède le rôle du staff
        if (!member || !(member.roles as any).cache.has(STAFF_ROLE_ID)) {
            await interaction.reply({ 
                content: 'Vous n\'avez pas la permission d\'utiliser cette commande.', 
                ephemeral: true 
            });
            return;
        }

        // Récupère l'utilisateur à ajouter depuis les options de la commande
        const user = interaction.options.getUser('utilisateur', true);

        // Récupère le serveur (guild) où l'interaction a eu lieu
        const guild = interaction.guild;

        // Vérifie si l'interaction a eu lieu dans un serveur
        if (!guild) {
            await interaction.reply({ 
                content: 'Impossible d\'ajouter un utilisateur en dehors d\'un serveur.', 
                ephemeral: true 
            });
            return;
        }

        // Récupère le membre de l'utilisateur à ajouter dans le serveur
        const memberToAdd = guild.members.cache.get(user.id);

        // Vérifie si l'utilisateur est bien membre du serveur
        if (!memberToAdd) {
            await interaction.reply({ 
                content: 'Utilisateur non trouvé dans le serveur.', 
                ephemeral: true 
            });
            return;
        }

        try {
            // Ajoute ou met à jour les permissions pour l'utilisateur dans le canal de ticket
            await channel.permissionOverwrites.create(user.id, {
                ViewChannel: true, // Permet à l'utilisateur de voir le canal
                SendMessages: true, // Permet à l'utilisateur d'envoyer des messages dans le canal
                ReadMessageHistory: true, // Permet à l'utilisateur de lire l'historique des messages
            });

            // Répond à l'utilisateur que l'ajout a été effectué avec succès
            await interaction.reply({ 
                content: `${user} a été ajouté au ticket.`, 
                ephemeral: false // Message visible par tous les membres du canal
            });
        } catch (error) {
            // Log l'erreur dans la console pour le dépannage
            console.error('Erreur lors de l\'ajout de l\'utilisateur au ticket :', error);

            // Répond à l'utilisateur qu'une erreur est survenue
            await interaction.reply({ 
                content: 'Une erreur est survenue lors de l\'ajout de l\'utilisateur au ticket.', 
                ephemeral: true 
            });
        }
    }
}
