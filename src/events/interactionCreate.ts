import { 
    Client, 
    Interaction, 
    InteractionType, 
    ModalSubmitInteraction, 
    TextChannel, 
    PermissionFlagsBits, 
    EmbedBuilder, 
    ActionRowBuilder, 
    ButtonBuilder, 
    ModalBuilder, 
    TextInputBuilder, 
    TextInputStyle, 
    AttachmentBuilder, 
    ChannelType, 
} from 'discord.js';

// Importation des composants et utilitaires personnalisés
import { createModalForCategory } from '../components/modals'; // Fonction pour créer des modales spécifiques basées sur la catégorie
import { getModalFieldsForCategory } from '../utils/getModalFieldsForCategory'; // Fonction pour récupérer les champs de la modale en fonction de la catégorie
import { categoryPrefixes } from '../constants/categoryPrefixes'; // Préfixes associés à chaque catégorie de ticket
import { 
    STAFF_ROLE_ID, 
    BUG_ROLE_ID_1, 
    BUG_ROLE_ID_2, 
    TRANSCRIPT_CHANNEL_ID, 
    CATEGORY_ID 
} from '../config/config'; // Constantes définissant les IDs des rôles, salons et catégories
import { createClaimButton, createCloseButton } from '../components/buttons'; // Fonctions pour créer les boutons de réclamation et de fermeture
import { fetchChannelMessages } from '../utils/transcript'; // Fonction pour récupérer tous les messages d'un salon
import { formatMessage } from '../utils/format'; // Fonction pour formater les messages en texte
import { execute as ticketAddExecute } from '../commands/ticketAdd'; // Exécution de la commande 'ticketAdd'
import { sanitizeChannelName } from '../utils/sanitize'; // Fonction pour sanitiser le nom des canaux

/**
 * Gère les interactions créées dans le bot Discord.
 * 
 * Cette fonction traite différents types d'interactions tels que les menus de sélection, les soumissions de modales,
 * les clics sur des boutons, et les commandes slash. Elle délègue le traitement à des fonctions spécifiques
 * en fonction du type et de l'ID de l'interaction.
 * 
 * @param {Client} client - Le client Discord.
 * @param {Interaction} interaction - L'interaction créée.
 */
export async function handleInteractionCreate(client: Client, interaction: Interaction) {
    // Vérifie si l'interaction est un menu de sélection (StringSelectMenu)
    if (interaction.isStringSelectMenu()) {
        // Vérifie si l'ID du menu de sélection est 'category_select'
        if (interaction.customId === 'category_select') {
            const selectedCategory = interaction.values[0]; // Récupère la catégorie sélectionnée

            // Crée la modale spécifique en fonction de la catégorie sélectionnée
            const modal = createModalForCategory(selectedCategory);

            // Affiche la modale à l'utilisateur
            await interaction.showModal(modal);
        }
    } 
    // Vérifie si l'interaction est une soumission de modale
    else if (interaction.type === InteractionType.ModalSubmit) {
        const modalInteraction = interaction as ModalSubmitInteraction; // Typecasting pour accéder aux propriétés spécifiques

        // Vérifie si l'ID de la modale commence par 'ticket_modal_'
        if (modalInteraction.customId.startsWith('ticket_modal_')) {
            // Extrait la catégorie à partir de l'ID de la modale
            const selectedCategory = modalInteraction.customId.replace('ticket_modal_', '');

            // Récupère les valeurs des champs de la modale en fonction de la catégorie
            const fields = getModalFieldsForCategory(selectedCategory, modalInteraction);

            // Récupère le serveur (guild) où l'interaction a eu lieu
            const guild = modalInteraction.guild;
            if (!guild) {
                // Répond avec un message d'erreur si l'interaction n'est pas dans un serveur
                await modalInteraction.reply({ content: 'Impossible de créer un ticket en dehors d\'un serveur.', ephemeral: true });
                return;
            }

            try {
                // Récupère le préfixe associé à la catégorie sélectionnée, ou 'ticket' par défaut
                const categoryPrefix = categoryPrefixes[selectedCategory] || 'ticket';

                // Sanitise le nom d'utilisateur pour éviter les caractères invalides dans le nom du canal
                const sanitizedUsername = sanitizeChannelName(modalInteraction.user.username);

                // Génère le nom du canal de ticket
                const channelName = `${categoryPrefix}-${sanitizedUsername}`;

                // Définition des permissions pour le canal de ticket
                const permissionOverwrites = [
                    {
                        id: guild.id, // Rôle @everyone
                        deny: [PermissionFlagsBits.ViewChannel], // Refuse la visibilité du canal à tout le monde
                    },
                    {
                        id: modalInteraction.user.id, // Utilisateur qui a créé le ticket
                        allow: [
                            PermissionFlagsBits.ViewChannel, 
                            PermissionFlagsBits.SendMessages, 
                            PermissionFlagsBits.ReadMessageHistory
                        ], // Autorise l'utilisateur à voir et interagir dans le canal
                    },
                    {
                        id: STAFF_ROLE_ID, // Rôle du staff
                        allow: [
                            PermissionFlagsBits.ViewChannel, 
                            PermissionFlagsBits.SendMessages, 
                            PermissionFlagsBits.ReadMessageHistory
                        ], // Autorise le staff à voir et interagir dans le canal
                    },
                ];

                // Ajout des permissions supplémentaires pour la catégorie 'signalement_bug'
                if (selectedCategory === 'signalement_bug') {
                    permissionOverwrites.push(
                        {
                            id: BUG_ROLE_ID_1, // Premier rôle autorisé pour les bugs
                            allow: [
                                PermissionFlagsBits.ViewChannel, 
                                PermissionFlagsBits.SendMessages, 
                                PermissionFlagsBits.ReadMessageHistory
                            ],
                        },
                        {
                            id: BUG_ROLE_ID_2, // Deuxième rôle autorisé pour les bugs
                            allow: [
                                PermissionFlagsBits.ViewChannel, 
                                PermissionFlagsBits.SendMessages, 
                                PermissionFlagsBits.ReadMessageHistory
                            ],
                        }
                    );
                }

                // Création du canal de ticket dans le serveur
                const ticketChannel = await guild.channels.create({
                    name: channelName, // Nom du canal
                    type: ChannelType.GuildText, // Type de canal : Texte
                    parent: CATEGORY_ID, // Catégorie sous laquelle le canal sera créé
                    topic: modalInteraction.user.id, // Stocke l'ID du créateur du ticket dans le topic du canal
                    permissionOverwrites: permissionOverwrites, // Applique les permissions définies
                }) as TextChannel;

                // Créer les boutons de réclamation et de fermeture
                const claimButton = createClaimButton();
                const closeButton = createCloseButton();

                // Ajouter les boutons dans une ligne de composants (Action Row)
                const buttonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(claimButton, closeButton);

                // Créer l'embed pour le message de bienvenue dans le canal de ticket
                const embed = new EmbedBuilder()
                    .setTitle(`Nouveau ticket créé par ${modalInteraction.user.tag}`) // Titre de l'embed
                    .setColor(0x00AE86) // Couleur de l'embed
                    .setTimestamp() // Ajoute l'horodatage actuel
                    .addFields({ name: 'Catégorie', value: selectedCategory, inline: true }); // Ajoute la catégorie du ticket

                // Ajouter les champs spécifiques de la modale à l'embed
                for (const fieldName in fields) {
                    embed.addFields({ name: fieldName, value: fields[fieldName], inline: false });
                }

                // Envoyer le message d'embed avec les boutons dans le canal de ticket
                await ticketChannel.send({
                    embeds: [embed],
                    components: [buttonRow],
                });

                // Envoyer un message de confirmation à l'utilisateur (visible uniquement à lui)
                await modalInteraction.reply({ content: `Votre ticket a été créé : <#${ticketChannel.id}>`, ephemeral: true });

            } catch (error) {
                // Gérer les erreurs lors de la création du canal de ticket
                console.error('Erreur lors de la création du canal de ticket :', error);
                await modalInteraction.reply({ content: 'Une erreur est survenue lors de la création de votre ticket.', ephemeral: true });
            }
        } 
        // Vérifie si l'ID de la modale est 'close_ticket_modal' pour gérer la fermeture d'un ticket
        else if (modalInteraction.customId === 'close_ticket_modal') {
            await handleCloseTicket(modalInteraction, client);
        }
    } 
    // Vérifie si l'interaction est un bouton (Button)
    else if (interaction.isButton()) {
        await handleButtonInteraction(interaction, client);
    } 
    // Vérifie si l'interaction est une commande de type ChatInput (slash command)
    else if (interaction.isChatInputCommand()) { // Utilise isChatInputCommand au lieu de isCommand pour plus de précision
        // Gérer les commandes slash
        if (interaction.commandName === 'ticket') {
            const subcommand = interaction.options.getSubcommand(); // Récupère le sous-commande si applicable

            if (subcommand === 'add') {
                // Exécute la logique de la commande 'ticket add'
                await ticketAddExecute(interaction);
            }

            // Ajoutez ici d'autres sous-commandes si nécessaire
        }
    }
}

/**
 * Gère la fermeture d'un ticket.
 * 
 * Cette fonction est appelée lorsqu'un utilisateur soumet une modale de fermeture de ticket.
 * Elle vérifie les permissions, génère un transcript et supprime le canal de ticket.
 * 
 * @param {ModalSubmitInteraction} interaction - L'interaction de soumission de la modale.
 * @param {Client} client - Le client Discord.
 */
async function handleCloseTicket(interaction: ModalSubmitInteraction, client: Client) {
    // Récupère le canal actuel et le cast en TextChannel
    const channel = interaction.channel as TextChannel;

    // Vérifie si le canal est un canal de ticket en vérifiant la présence d'un '-' dans le nom
    if (!channel || !channel.name.includes('-')) {
        await interaction.reply({ content: 'Cette action ne peut être effectuée que dans un canal de ticket.', ephemeral: true });
        return;
    }

    // Récupère les informations sur le membre qui a interagi
    const member = interaction.member;
    const isStaff = (member?.roles as any).cache.has(STAFF_ROLE_ID); // Vérifie si l'utilisateur a le rôle du staff
    const isTicketOwner = channel.topic === interaction.user.id; // Vérifie si l'utilisateur est le créateur du ticket

    // Vérifie si l'utilisateur a les permissions nécessaires pour fermer le ticket
    if (!isStaff && !isTicketOwner) {
        await interaction.reply({ content: 'Vous n\'avez pas la permission de fermer ce ticket.', ephemeral: true });
        return;
    }

    // Récupère le motif de fermeture fourni par l'utilisateur
    const closeReason = interaction.fields.getTextInputValue('close_reason') || 'Aucun motif fourni.';

    // Essayez de générer et d'envoyer le transcript du ticket
    try {
        // Récupère tous les messages du canal de ticket
        const messages = await fetchChannelMessages(channel);

        // Formate les messages en une chaîne de caractères
        const transcript = messages.reverse().map(formatMessage).join('\n');

        // Crée une pièce jointe avec le transcript
        const attachment = new AttachmentBuilder(Buffer.from(transcript, 'utf-8'), { name: `transcript-${channel.name}.txt` });

        // Récupère le salon dédié aux transcripts
        const transcriptChannel = await client.channels.fetch(TRANSCRIPT_CHANNEL_ID) as TextChannel;
        if (transcriptChannel) {
            // Envoie le transcript dans le salon des transcripts avec le motif de fermeture
            await transcriptChannel.send({ 
                content: `Transcript du ticket ${channel.name} fermé par ${interaction.user}\nMotif : ${closeReason}`, 
                files: [attachment] 
            });
        }
    } catch (error) {
        // Gère les erreurs lors de la création du transcript
        console.error('Erreur lors de la création du transcript :', error);
    }

    // Répond à l'utilisateur que le ticket a été fermé avec le motif
    await interaction.reply({ content: `Ticket fermé par ${interaction.user}\nMotif : ${closeReason}` });

    // Supprime le canal de ticket après un délai de 5 secondes pour permettre la lecture du message de confirmation
    setTimeout(async () => {
        await channel.delete().catch(console.error);
    }, 5000);
}

/**
 * Gère les interactions de type bouton (Buttons) dans les canaux de ticket.
 * 
 * Cette fonction traite les actions de réclamation et de fermeture des tickets en fonction de l'ID du bouton cliqué.
 * 
 * @param {Interaction} interaction - L'interaction de type bouton.
 * @param {Client} client - Le client Discord.
 */
async function handleButtonInteraction(interaction: Interaction, client: Client) {
    // Vérifie si l'interaction est bien de type bouton
    if (!interaction.isButton()) return;

    // Récupère le canal actuel et le cast en TextChannel
    const channel = interaction.channel as TextChannel;

    // Vérifie si l'interaction se trouve dans un canal de ticket
    if (!channel || !channel.name.includes('-')) {
        await interaction.reply({ content: 'Ce bouton ne peut être utilisé que dans un canal de ticket.', ephemeral: true });
        return;
    }

    // Gestion du bouton de réclamation du ticket
    if (interaction.customId === 'claim_ticket') {
        // Récupère les informations sur le membre qui a interagi
        const member = interaction.member;
        const isStaff = (member?.roles as any).cache.has(STAFF_ROLE_ID); // Vérifie si l'utilisateur a le rôle du staff

        // Vérifie si l'utilisateur a les permissions pour réclamer le ticket
        if (!isStaff) {
            await interaction.reply({ content: 'Vous n\'avez pas la permission de réclamer ce ticket.', ephemeral: true });
            return;
        }

        // Ajoute les permissions nécessaires pour que l'utilisateur puisse gérer le canal
        await channel.permissionOverwrites.edit(interaction.user.id, {
            ViewChannel: true,
            SendMessages: true,
            ReadMessageHistory: true,
        });

        // Répond à l'utilisateur que le ticket a été réclamé
        await interaction.reply({ content: `${interaction.user} a réclamé le ticket et va désormais s'occuper de vous. Merci pour votre patience.`, ephemeral: false });
    } 
    // Gestion du bouton de fermeture du ticket
    else if (interaction.customId === 'close_ticket') {
        // Crée une modale pour que l'utilisateur puisse fournir le motif de fermeture
        const reasonModal = new ModalBuilder()
            .setCustomId('close_ticket_modal') // ID unique pour la modale de fermeture
            .setTitle('Motif de fermeture du ticket'); // Titre de la modale

        // Crée un champ de saisie pour le motif de fermeture
        const reasonInput = new TextInputBuilder()
            .setCustomId('close_reason') // ID unique pour le champ de saisie
            .setLabel('Motif de fermeture') // Étiquette du champ
            .setStyle(TextInputStyle.Paragraph) // Style de saisie : paragraphe
            .setRequired(false) // Champ optionnel
            .setPlaceholder('Décrivez la raison de la fermeture du ticket.'); // Placeholder du champ

        // Ajoute le champ de saisie dans une ligne de composants (Action Row)
        const modalRow = new ActionRowBuilder<TextInputBuilder>().addComponents(reasonInput);
        reasonModal.addComponents(modalRow); // Ajoute la ligne de composants à la modale

        // Affiche la modale à l'utilisateur
        await interaction.showModal(reasonModal);
    }
}
