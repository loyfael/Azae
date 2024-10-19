// src/index.ts

import { 
    Client, 
    GatewayIntentBits, 
    ActionRowBuilder, 
    StringSelectMenuBuilder, 
    ModalBuilder, 
    TextInputBuilder, 
    TextInputStyle, 
    InteractionType, 
    TextChannel,
    ChannelType,
    PermissionFlagsBits,
    Events,
    Partials,
    SlashCommandBuilder,
} from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();

// **Remplacez les valeurs ci-dessous par vos propres IDs**
const CHANNEL_ID = '1263546795586490419'; // ID du salon pour le menu de sélection
const CATEGORY_ID = '1263546795586490418'; // ID de la catégorie pour les tickets
const STAFF_ROLE_ID = '1263546795137437714'; // ID du rôle du staff
const GUILD_ID = '1263546794957078614'; // ID de votre serveur

const client = new Client({ 
    intents: [GatewayIntentBits.Guilds], // Retiré GatewayIntentBits.GuildMembers
    partials: [Partials.Channel] 
});

client.once(Events.ClientReady, () => {
    console.log(`Connecté en tant que ${client.user?.tag}`);
    sendSelectMenuMessage();
    registerCommands();
});

async function sendSelectMenuMessage() {
    try {
        const channel = await client.channels.fetch(CHANNEL_ID) as TextChannel;
        if (!channel) {
            console.error('Salon non trouvé.');
            return;
        }

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('category_select')
            .setPlaceholder('Sélectionnez une catégorie')
            .addOptions(
                {
                    label: 'Support Technique',
                    description: 'Obtenez de l\'aide pour les problèmes techniques',
                    value: 'support_technique',
                },
                {
                    label: 'Signalement de Bug',
                    description: 'Signalez un bug rencontré en jeu',
                    value: 'signalement_bug',
                },
                {
                    label: 'Autre',
                    description: 'Pour toute autre demande',
                    value: 'autre',
                },
            );

        const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu);

        await channel.send({ content: 'Veuillez sélectionner une catégorie pour votre ticket :', components: [row] });
        console.log('Message avec le menu de sélection envoyé avec succès.');
    } catch (error) {
        console.error('Erreur lors de l\'envoi du message :', error);
    }
}

client.on(Events.InteractionCreate, async interaction => {
    if (interaction.isStringSelectMenu()) {
        if (interaction.customId === 'category_select') {
            const selectedCategory = interaction.values[0];

            // Créer la modale
            const modal = new ModalBuilder()
                .setCustomId(`ticket_modal_${selectedCategory}`)
                .setTitle('Ouvrir un Ticket');

            // Champ pour le pseudo en jeu
            const usernameInput = new TextInputBuilder()
                .setCustomId('username')
                .setLabel('Votre pseudo en jeu')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            // Champ pour la raison du ticket
            const reasonInput = new TextInputBuilder()
                .setCustomId('reason')
                .setLabel('Raison du ticket')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true);

            // Ajouter les champs à la modale
            const modalRow1 = new ActionRowBuilder<TextInputBuilder>().addComponents(usernameInput);
            const modalRow2 = new ActionRowBuilder<TextInputBuilder>().addComponents(reasonInput);

            modal.addComponents(modalRow1, modalRow2);

            await interaction.showModal(modal);
        }
    } else if (interaction.type === InteractionType.ModalSubmit) {
        if (interaction.customId.startsWith('ticket_modal_')) {
            const username = interaction.fields.getTextInputValue('username');
            const reason = interaction.fields.getTextInputValue('reason');

            const selectedCategory = interaction.customId.replace('ticket_modal_', '');

            // Créer un nouveau canal de ticket
            const guild = interaction.guild;
            if (!guild) {
                await interaction.reply({ content: 'Impossible de créer un ticket en dehors d\'un serveur.', ephemeral: true });
                return;
            }

            try {
                const channelName = `ticket-${interaction.user.username}-${interaction.user.discriminator}`;

                const ticketChannel = await guild.channels.create({
                    name: channelName,
                    type: ChannelType.GuildText,
                    parent: CATEGORY_ID,
                    permissionOverwrites: [
                        {
                            id: guild.id,
                            deny: [PermissionFlagsBits.ViewChannel],
                        },
                        {
                            id: interaction.user.id,
                            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
                        },
                        {
                            id: STAFF_ROLE_ID,
                            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
                        },
                    ],
                });

                // Envoyer un message de confirmation à l'utilisateur
                await interaction.reply({ content: `Votre ticket a été créé : ${ticketChannel}`, ephemeral: true });

                // Envoyer les détails du ticket dans le nouveau canal
                await ticketChannel.send(`**Nouveau ticket créé par ${interaction.user}**

**Catégorie :** ${selectedCategory}
**Pseudo en jeu :** ${username}
**Raison du ticket :** ${reason}

Un membre du staff vous répondra dès que possible. Pour fermer ce ticket, utilisez la commande \`/fermer\`.`);

            } catch (error) {
                console.error('Erreur lors de la création du canal de ticket :', error);
                await interaction.reply({ content: 'Une erreur est survenue lors de la création de votre ticket.', ephemeral: true });
            }
        }
    } else if (interaction.isChatInputCommand()) {
        if (interaction.commandName === 'fermer') {
            const channel = interaction.channel as TextChannel;
            if (!channel.name.startsWith('ticket-')) {
                await interaction.reply({ content: 'Vous ne pouvez pas utiliser cette commande en dehors d\'un canal de ticket.', ephemeral: true });
                return;
            }

            // Vérifier si l'utilisateur a la permission de fermer le ticket
            if (
                interaction.user.id === interaction.client.user?.id ||
                channel.permissionsFor(interaction.user)?.has(PermissionFlagsBits.ManageChannels) ||
                channel.permissionsFor(interaction.user)?.has(PermissionFlagsBits.ManageMessages) ||
                interaction.user.id === channel.name.split('-')[1] // Vérifie si l'utilisateur est le créateur du ticket
            ) {
                await interaction.reply({ content: 'Ce ticket sera fermé dans 5 secondes.', ephemeral: true });
                setTimeout(async () => {
                    await channel.delete().catch(console.error);
                }, 5000);
            } else {
                await interaction.reply({ content: 'Vous n\'avez pas la permission de fermer ce ticket.', ephemeral: true });
            }
        }
    }
});

// Enregistrement de la commande "/fermer"
async function registerCommands() {
    try {
        const guild = await client.guilds.fetch(GUILD_ID);
        await guild.commands.create({
            name: 'fermer',
            description: 'Ferme le ticket actuel',
        });
        console.log('Commande "/fermer" enregistrée avec succès.');
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement de la commande :', error);
    }
}

client.login(process.env.DISCORD_BOT_TOKEN);
