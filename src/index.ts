// src/index.ts

import { 
    Client, 
    GatewayIntentBits, 
    Partials,
    Events,
    TextChannel,
    ChannelType,
    ActionRowBuilder, 
    StringSelectMenuBuilder, 
    ModalBuilder, 
    TextInputBuilder, 
    TextInputStyle,
    InteractionType,
    ButtonBuilder,
    ButtonStyle,
    PermissionFlagsBits,
    AttachmentBuilder,
    Message,
    EmbedBuilder,
} from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();

// **Remplacez les valeurs ci-dessous par vos propres IDs**
const CHANNEL_ID = '1263546795586490419'; // ID du salon pour le menu de sélection
const CATEGORY_ID = '1263546795586490418'; // ID de la catégorie pour les tickets
const STAFF_ROLE_ID = '1263546795137437714'; // ID du rôle du staff
const TRANSCRIPT_CHANNEL_ID = '1299661497575931914'; // ID du salon où envoyer les transcripts

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages,
        // GatewayIntentBits.MessageContent, // Intention non utilisée
    ],
    partials: [Partials.Channel, Partials.Message] 
});

client.once(Events.ClientReady, () => {
    console.log(`Connecté en tant que ${client.user?.tag}`);
    sendSelectMenuMessage();
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
                    label: 'Partenariats',
                    value: 'partenariats',
                },
                {
                    label: 'Questions & Aide',
                    value: 'questions_aide',
                },
                {
                    label: 'Plainte',
                    value: 'plainte',
                },
                {
                    label: 'Remboursements',
                    value: 'remboursements',
                },
                {
                    label: 'Signalement de bug',
                    value: 'signalement_bug',
                },
                {
                    label: 'Contestation de sanction',
                    value: 'contestation_sanction',
                },
                {
                    label: 'Problème boutique',
                    value: 'probleme_boutique',
                },
                {
                    label: 'Intervention',
                    value: 'intervention',
                },
            );

        const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu);

        // Utilisation d'un embed pour le message
        const embed = new EmbedBuilder()
            .setTitle('Système de tickets de BadLands')
            .setDescription(`
                # Bienvenue ! :wave::skin-tone-2:
                Cliquez sur le menu ci-dessous pour sélectionner un motif d'ouverture de ticket.
                Lors de l'ouverture d'un ticket, n'oubliez jamais les formes et la politesse. Les tickets ouverts sans sont automatiquement fermés.

                Veuillez sélectionner une catégorie pour votre ticket.
                
                **Partenariat**
                Je suis vidéaste, et je souhaite obtenir le grade Ambassadeur. 
                Je suis membre d'une organisation et souhaite nouer un partenariat.

                **Question / Aide**
                Je souhaite poser une question. J'ai envie d'organiser un événement et j'ai besoin d'aide pour l'organiser.

                **Plainte**
                Un joueur des BadLands me dérange. Je souhaite déposer plainte envers celui-ci.

                **Remboursement**
                Vous avez perdu votre stuff à cause d'un bug.

                **Signalement de bug**
                J'ai rencontré un problème / un comportement anormal du serveur de jeu et souhaite le signaler.

                **Contestation de sanction**
                J'ai été sanctionné et conteste ma sanction.

                **Intervention**
                Tickets nécessitant l'intervention d'un opérateur (Unclaim d'un land, placer une affiche dans le Spawn...)

                **Boutique**
                Tickets concernant notre boutique (https://store.badlands.fr/)
                `)
            .setColor(0x00AE86);

        await channel.send({ embeds: [embed], components: [row] });
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
                    topic: interaction.user.id, // Stocke l'ID du créateur du ticket
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

                // Créer les boutons de réclamation et de fermeture
                const claimButton = new ButtonBuilder()
                    .setCustomId('claim_ticket')
                    .setLabel('Réclamer le ticket')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('🛠️');

                const closeButton = new ButtonBuilder()
                    .setCustomId('close_ticket')
                    .setLabel('Fermer le ticket')
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji('❌');

                const buttonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(claimButton, closeButton);

                // Utilisation d'un embed pour le message du ticket
                const embed = new EmbedBuilder()
                    .setTitle(`Nouveau ticket créé par ${interaction.user.tag}`)
                    .addFields(
                        { name: 'Catégorie', value: selectedCategory, inline: true },
                        { name: 'Pseudo en jeu', value: username, inline: true },
                        { name: 'Raison du ticket', value: reason },
                    )
                    .setColor(0x00AE86)
                    .setTimestamp();

                // Envoyer le message dans le canal du ticket avec les boutons
                await ticketChannel.send({
                    embeds: [embed],
                    components: [buttonRow],
                });

                // Envoyer un message de confirmation à l'utilisateur
                await interaction.reply({ content: `Votre ticket a été créé : ${ticketChannel}`, ephemeral: true });

            } catch (error) {
                console.error('Erreur lors de la création du canal de ticket :', error);
                await interaction.reply({ content: 'Une erreur est survenue lors de la création de votre ticket.', ephemeral: true });
            }
        } else if (interaction.customId === 'close_ticket_modal') {
            const channel = interaction.channel as TextChannel;
            if (!channel || !channel.name.startsWith('ticket-')) {
                await interaction.reply({ content: 'Cette action ne peut être effectuée que dans un canal de ticket.', ephemeral: true });
                return;
            }

            const member = interaction.member;
            const isStaff = (member?.roles as any).cache.has(STAFF_ROLE_ID);
            const isTicketOwner = channel.topic === interaction.user.id;

            if (!isStaff && !isTicketOwner) {
                await interaction.reply({ content: 'Vous n\'avez pas la permission de fermer ce ticket.', ephemeral: true });
                return;
            }

            const closeReason = interaction.fields.getTextInputValue('close_reason') || 'Aucun motif fourni.';

            // Envoyer le transcript
            try {
                const messages = await fetchChannelMessages(channel);
                const transcript = messages.reverse().map(formatMessage).join('\n');

                const attachment = new AttachmentBuilder(Buffer.from(transcript, 'utf-8'), { name: `transcript-${channel.name}.txt` });

                const transcriptChannel = await client.channels.fetch(TRANSCRIPT_CHANNEL_ID) as TextChannel;
                if (transcriptChannel) {
                    await transcriptChannel.send({ content: `Transcript du ticket ${channel.name} fermé par ${interaction.user}\nMotif : ${closeReason}`, files: [attachment] });
                }
            } catch (error) {
                console.error('Erreur lors de la création du transcript :', error);
            }

            await interaction.reply({ content: `Ticket fermé par ${interaction.user}\nMotif : ${closeReason}` });

            setTimeout(async () => {
                await channel.delete().catch(console.error);
            }, 5000);
        }
    } else if (interaction.isButton()) {
        const channel = interaction.channel as TextChannel;
        if (!channel || !channel.name.startsWith('ticket-')) {
            await interaction.reply({ content: 'Ce bouton ne peut être utilisé que dans un canal de ticket.', ephemeral: true });
            return;
        }

        if (interaction.customId === 'claim_ticket') {
            // Vérifier si l'utilisateur a le rôle du staff
            const member = interaction.member;
            const isStaff = (member?.roles as any).cache.has(STAFF_ROLE_ID);

            if (!isStaff) {
                await interaction.reply({ content: 'Vous n\'avez pas la permission de réclamer ce ticket.', ephemeral: true });
                return;
            }

            // Ajouter une permission pour le membre
            await channel.permissionOverwrites.edit(interaction.user.id, {
                ViewChannel: true,
                SendMessages: true,
                ReadMessageHistory: true,
            });

            await interaction.reply({ content: `${interaction.user} a réclamé le ticket et va désormais s'occuper de vous. Merci pour votre patience.` });
        } else if (interaction.customId === 'close_ticket') {
            // Ajouter une modale pour le motif de fermeture
            const reasonModal = new ModalBuilder()
                .setCustomId('close_ticket_modal')
                .setTitle('Motif de fermeture du ticket');

            const reasonInput = new TextInputBuilder()
                .setCustomId('close_reason')
                .setLabel('Motif de fermeture')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(false);

            const modalRow = new ActionRowBuilder<TextInputBuilder>().addComponents(reasonInput);
            reasonModal.addComponents(modalRow);

            await interaction.showModal(reasonModal);
        }
    }
});

async function fetchChannelMessages(channel: TextChannel): Promise<Message[]> {
    let messages: Message[] = [];
    let lastId: string | undefined;

    while (true) {
        const fetchedMessages = await channel.messages.fetch({ limit: 100, before: lastId });
        if (fetchedMessages.size === 0) {
            break;
        }
        messages = messages.concat(Array.from(fetchedMessages.values()));
        lastId = fetchedMessages.last()?.id;
    }
    return messages;
}

// Fonction pour formater les messages pour le transcript sans utiliser message.content des utilisateurs
function formatMessage(message: Message): string {
    const author = `${message.author.tag}`;
    let content = '';

    // Si le message est envoyé par le bot, nous avons accès à message.content
    if (message.author.bot) {
        content = message.content || '[Aucun contenu]';
    } else {
        content = '[Contenu du message indisponible]';
    }

    // Si le message a des embeds, les inclure
    if (message.embeds.length > 0) {
        content += '\n[Embed]';
        message.embeds.forEach(embed => {
            if (embed.title) content += `\nTitre: ${embed.title}`;
            if (embed.description) content += `\nDescription: ${embed.description}`;
            if (embed.fields) {
                embed.fields.forEach(field => {
                    content += `\n${field.name}: ${field.value}`;
                });
            }
        });
    }

    // Si le message a des pièces jointes, les inclure
    if (message.attachments.size > 0) {
        content += '\n[Pièces jointes]';
        message.attachments.forEach(attachment => {
            content += `\n${attachment.url}`;
        });
    }

    return `${author}: ${content}`;
}

client.login(process.env.DISCORD_BOT_TOKEN);
