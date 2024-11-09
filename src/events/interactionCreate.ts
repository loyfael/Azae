import { 
    Client, 
    Interaction, 
    InteractionType, 
    ModalSubmitInteraction, 
    StringSelectMenuInteraction, 
    ChatInputCommandInteraction, 
    ButtonInteraction, 
    TextChannel, 
    EmbedBuilder, 
    ActionRowBuilder, 
    ButtonBuilder, 
    ModalBuilder, 
    TextInputBuilder, 
    TextInputStyle, 
    ChannelType, 
    AttachmentBuilder 
} from 'discord.js';

import { createModalForCategory } from '../components/modals';
import { getModalFieldsForCategory } from '../utils/getModalFieldsForCategory';
import { getPermissionsBasedOnTicketName } from '../utils/permissionManager';
import { CATEGORY_ID, TRANSCRIPT_CHANNEL_ID } from '../config/config';
import { createClaimButton, createCloseButton } from '../components/buttons';
import { fetchChannelMessages } from '../utils/transcript';
import { formatMessage } from '../utils/format';
import { sanitizeChannelName } from '../utils/sanitize';
import { categoryPrefixes } from '../constants/categoryPrefixes'; // Reimport des préfixes pour les catégories

export async function handleInteractionCreate(client: Client, interaction: Interaction) {
    if (interaction.isStringSelectMenu()) {
        const selectMenuInteraction = interaction as StringSelectMenuInteraction;

        if (selectMenuInteraction.customId === 'category_select') {
            const selectedCategory = selectMenuInteraction.values[0];
            const modal = createModalForCategory(selectedCategory);
            await selectMenuInteraction.showModal(modal);
        }
    } 
    else if (interaction.type === InteractionType.ModalSubmit) {
        const modalInteraction = interaction as ModalSubmitInteraction;

        if (modalInteraction.customId.startsWith('ticket_modal_')) {
            const selectedCategory = modalInteraction.customId.replace('ticket_modal_', '');
            const fields = getModalFieldsForCategory(selectedCategory, modalInteraction);
            const guild = modalInteraction.guild;

            if (!guild) {
                await modalInteraction.reply({ content: 'Impossible de créer un ticket en dehors d\'un serveur.', ephemeral: true });
                return;
            }

            try {
                // Récupération du préfixe pour la catégorie via categoryPrefixes
                const categoryPrefix = categoryPrefixes[selectedCategory] || selectedCategory;

                // Sanitize le nom d'utilisateur et construit le nom de canal
                const sanitizedUsername = sanitizeChannelName(modalInteraction.user.username);
                const channelName = `${categoryPrefix}-${sanitizedUsername}`;

                // Permissions spécifiques basées sur le nom de canal
                const permissionOverwrites = getPermissionsBasedOnTicketName(channelName, guild);

                const ticketChannel = await guild.channels.create({
                    name: channelName,
                    type: ChannelType.GuildText,
                    parent: CATEGORY_ID,
                    topic: modalInteraction.user.id,
                    permissionOverwrites,
                }) as TextChannel;

                const claimButton = createClaimButton();
                const closeButton = createCloseButton();
                const buttonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(claimButton, closeButton);

                const embed = new EmbedBuilder()
                    .setTitle(`Nouveau ticket créé par ${modalInteraction.user.tag}`)
                    .setColor(0x00AE86)
                    .setTimestamp()
                    .addFields({ name: 'Catégorie', value: selectedCategory, inline: true });

                for (const fieldName in fields) {
                    embed.addFields({ name: fieldName, value: fields[fieldName], inline: false });
                }

                await ticketChannel.send({
                    embeds: [embed],
                    components: [buttonRow],
                });

                await modalInteraction.reply({ content: `Votre ticket a été créé : <#${ticketChannel.id}>`, ephemeral: true });
            } catch (error) {
                console.error('Erreur lors de la création du canal de ticket :', error);
                await modalInteraction.reply({ content: 'Une erreur est survenue lors de la création de votre ticket.', ephemeral: true });
            }
        } 
        else if (modalInteraction.customId === 'close_ticket_modal') {
            await handleCloseTicket(modalInteraction, client);
        }
    } 
    else if (interaction.isButton()) {
        const buttonInteraction = interaction as ButtonInteraction;
        await handleButtonInteraction(buttonInteraction, client);
    } 
    else if (interaction.isChatInputCommand()) {
        const chatInputInteraction = interaction as ChatInputCommandInteraction;

        if (chatInputInteraction.commandName === 'ticket') {
            await chatInputInteraction.reply({ content: 'Commande ticket en cours de développement.', ephemeral: true });
        }
    }
}

async function handleCloseTicket(interaction: ModalSubmitInteraction, client: Client) {
    const channel = interaction.channel as TextChannel;

    if (!channel || !channel.name.includes('-')) {
        await interaction.reply({ content: 'Cette action ne peut être effectuée que dans un canal de ticket.', ephemeral: true });
        return;
    }

    const closeReason = interaction.fields.getTextInputValue('close_reason') || 'Aucun motif fourni.';

    try {
        const messages = await fetchChannelMessages(channel);
        const transcript = messages.reverse().map(formatMessage).join('\n');

        const attachment = new AttachmentBuilder(Buffer.from(transcript, 'utf-8'), { name: `transcript-${channel.name}.txt` });

        const transcriptChannel = await client.channels.fetch(TRANSCRIPT_CHANNEL_ID) as TextChannel;
        if (transcriptChannel) {
            await transcriptChannel.send({
                content: `Transcript du ticket ${channel.name} fermé par ${interaction.user}\nMotif : ${closeReason}`,
                files: [attachment],
            });
        }
    } catch (error) {
        console.error('Erreur lors de la création du transcript :', error);
    }

    await interaction.reply({ content: `Ticket fermé par ${interaction.user}\nMotif : ${closeReason}` });

    setTimeout(async () => {
        await channel.delete().catch(console.error);
    }, 5000);
}

async function handleButtonInteraction(interaction: ButtonInteraction, client: Client) {
    const channel = interaction.channel as TextChannel;

    if (!channel || !channel.name.includes('-')) {
        await interaction.reply({ content: 'Ce bouton ne peut être utilisé que dans un canal de ticket.', ephemeral: true });
        return;
    }

    if (interaction.customId === 'claim_ticket') {
        await channel.permissionOverwrites.edit(interaction.user.id, {
            ViewChannel: true,
            SendMessages: true,
            ReadMessageHistory: true,
        });

        await interaction.reply({ content: `${interaction.user} a réclamé le ticket.`, ephemeral: false });
    } else if (interaction.customId === 'close_ticket') {
        const reasonModal = new ModalBuilder()
            .setCustomId('close_ticket_modal')
            .setTitle('Motif de fermeture du ticket');

        const reasonInput = new TextInputBuilder()
            .setCustomId('close_reason')
            .setLabel('Motif de fermeture')
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(false)
            .setPlaceholder('Décrivez la raison de la fermeture.');

        const modalRow = new ActionRowBuilder<TextInputBuilder>().addComponents(reasonInput);
        reasonModal.addComponents(modalRow);

        await interaction.showModal(reasonModal);
    }
}
