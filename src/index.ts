// src/index.ts

import {
    Client,
    GatewayIntentBits,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    ButtonBuilder,
    ButtonStyle,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    InteractionType,
    TextChannel,
    ChannelType,
    PermissionFlagsBits,
    Events,
    Partials,
    AttachmentBuilder,
    EmbedBuilder,
    Message,
} from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();

// **Remplacez les valeurs ci-dessous par vos propres IDs**
const CHANNEL_ID = '1263546795586490419'; // ID du salon pour le menu de sélection
const CATEGORY_ID = '1263546795586490418'; // ID de la catégorie pour les tickets
const STAFF_ROLE_ID = '1263546795137437714'; // ID du rôle du staff
const TRANSCRIPT_CHANNEL_ID = '1299661497575931914'; // ID du salon où envoyer les transcripts

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
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
                    description: "Je veux être partenaire.",
                    emoji: "📹"
                },
                {
                    label: 'Questions & Aide',
                    value: 'questions_aide',
                    description: "J'ai une question | besoin d'aide.",
                    emoji: "❓"
                },
                {
                    label: 'Plainte',
                    value: 'plainte',
                    description: "J'ai une plainte à déposer contre un joueur.",
                    emoji: "😡"
                },
                {
                    label: 'Remboursements',
                    value: 'remboursements',
                    description: "J'ai perdu mon stuff à cause d'un bug.",
                    emoji: "🎒"
                },
                {
                    label: 'Signalement de bug',
                    value: 'signalement_bug',
                    description: "Je veux signaler un bug.",
                    emoji: "🐛"
                },
                {
                    label: 'Contestation de sanction',
                    value: 'contestation_sanction',
                    description: "Je veux contester une sanction",
                    emoji: "🗣️"

                },
                {
                    label: 'Problème boutique',
                    value: 'probleme_boutique',
                    description: "J'ai eu un problème avec la boutique.",
                    emoji: "💳"
                },
                {
                    label: 'Intervention',
                    value: 'intervention',
                    description: "J'ai besoin d'un unclaim, afficher au spawn..",
                    emoji: "📩"
                },
            );

        const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu);

        // Création de l'embed pour le message
        const embed = new EmbedBuilder()
            .setTitle('Créer un Ticket')
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

            // Créer la modale spécifique en fonction de la catégorie
            const modal = createModalForCategory(selectedCategory);

            await interaction.showModal(modal);
        }
    } else if (interaction.type === InteractionType.ModalSubmit) {
        if (interaction.customId.startsWith('ticket_modal_')) {
            const selectedCategory = interaction.customId.replace('ticket_modal_', '');

            // Récupérer les valeurs des champs de la modale
            const fields = getModalFieldsForCategory(selectedCategory, interaction);

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

                // Créer l'embed pour le message du ticket
                const embed = new EmbedBuilder()
                    .setTitle(`Nouveau ticket créé par ${interaction.user.tag}`)
                    .setColor(0x00AE86)
                    .setTimestamp();

                // Ajouter les champs au message du ticket
                embed.addFields({ name: 'Catégorie', value: selectedCategory, inline: true });

                for (const fieldName in fields) {
                    embed.addFields({ name: fieldName, value: fields[fieldName], inline: false });
                }

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

// Fonction pour créer la modale en fonction de la catégorie
function createModalForCategory(category: string): ModalBuilder {
    const modal = new ModalBuilder()
        .setCustomId(`ticket_modal_${category}`)
        .setTitle('Ouvrir un Ticket');

    const components: ActionRowBuilder<TextInputBuilder>[] = [];

    // Champ commun : Pseudo en jeu (obligatoire)
    const usernameInput = new TextInputBuilder()
        .setCustomId('Pseudo en jeu')
        .setLabel('Votre pseudo en jeu')
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
        .setPlaceholder("Entrez votre pseudo en jeu.");

    components.push(new ActionRowBuilder<TextInputBuilder>().addComponents(usernameInput));

    switch (category) {
        case 'signalement_bug':
            // Sur lequel de nos serveur et/ou monde ? (obligatoire)
            const serverWorldInput_bug = new TextInputBuilder()
                .setCustomId('Serveur/Monde')
                .setLabel('Sur quel serveur/monde ?')
                .setStyle(TextInputStyle.Short)
                .setRequired(false)
                .setPlaceholder("Sur lequel de nos serveur et/ou monde ?");

            // Description du bug (obligatoire)
            const bugDescriptionInput = new TextInputBuilder()
                .setCustomId('Description du bug')
                .setLabel('Description du bug')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true)
                .setPlaceholder("Quel bug avez-vous rencontré(e) ?");

            // Comment reproduire le bug? (optionnel)
            const reproduceBugInput = new TextInputBuilder()
                .setCustomId('Comment reproduire le bug')
                .setLabel('Comment reproduire le bug ?')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(false)
                .setPlaceholder("Expliquez-nous comment reproduire ce bug.");

            // Erreur dans le tchat (optionnel)
            const chatErrorInput = new TextInputBuilder()
                .setCustomId('Erreur dans le tchat')
                .setLabel('Erreur dans le tchat')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(false)
                .setPlaceholder("Écrivez l'erreur si il y en a une.");

            components.push(
                new ActionRowBuilder<TextInputBuilder>().addComponents(serverWorldInput_bug),
                new ActionRowBuilder<TextInputBuilder>().addComponents(bugDescriptionInput),
                new ActionRowBuilder<TextInputBuilder>().addComponents(reproduceBugInput),
                new ActionRowBuilder<TextInputBuilder>().addComponents(chatErrorInput),
            );
            break;

        case 'plainte':
            // Sur lequel de nos serveur et/ou monde ? (obligatoire)
            const serverWorldInput_plainte = new TextInputBuilder()
                .setCustomId('Serveur/Monde')
                .setLabel('Sur quel serveur/monde ?')
                .setStyle(TextInputStyle.Short)
                .setRequired(false)
                .setPlaceholder("Sur lequel de nos serveur et/ou monde ?");

            // Pseudo du/des fautif(s) (obligatoire)
            const offenderInput = new TextInputBuilder()
                .setCustomId('Pseudo du/des fautif(s)')
                .setLabel('Pseudo du/des fautif(s)')
                .setStyle(TextInputStyle.Short)
                .setRequired(true)
                .setPlaceholder("Entrez le(s) pseudo(s) du/des fautif(s).");

            // Description du problème (obligatoire)
            const problemDescriptionInput = new TextInputBuilder()
                .setCustomId('Description du problème')
                .setLabel('Description du problème')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true)
                .setPlaceholder("Décrivez le problème rencontré.");

            components.push(
                new ActionRowBuilder<TextInputBuilder>().addComponents(serverWorldInput_plainte),
                new ActionRowBuilder<TextInputBuilder>().addComponents(offenderInput),
                new ActionRowBuilder<TextInputBuilder>().addComponents(problemDescriptionInput),
            );
            break;

        case 'questions_aide':
            // Sur lequel de nos serveur et/ou monde ? (obligatoire)
            const serverWorldInput_aide = new TextInputBuilder()
                .setCustomId('Serveur/Monde')
                .setLabel('Sur quel serveur/monde ?')
                .setStyle(TextInputStyle.Short)
                .setRequired(false)
                .setPlaceholder("Sur lequel de nos serveur et/ou monde ?");

            // De quoi avez-vous besoin ? (obligatoire)
            const needInput = new TextInputBuilder()
                .setCustomId('Votre demande')
                .setLabel('De quoi avez-vous besoin ?')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true)
                .setPlaceholder("Expliquez votre besoin.");

            components.push(
                new ActionRowBuilder<TextInputBuilder>().addComponents(serverWorldInput_aide),
                new ActionRowBuilder<TextInputBuilder>().addComponents(needInput),
            );
            break;

        case 'remboursements':
            // Sur lequel de nos serveur et/ou monde ? (obligatoire)
            const serverWorldInput_remboursement = new TextInputBuilder()
                .setCustomId('Serveur/Monde')
                .setLabel('Sur quel serveur/monde ?')
                .setStyle(TextInputStyle.Short)
                .setRequired(false)
                .setPlaceholder("Sur lequel de nos serveur et/ou monde ?");

            // Comment avez-vous perdu vos équipements ? (obligatoire)
            const lossExplanationInput = new TextInputBuilder()
                .setCustomId('Comment avez-vous perdu vos équipements')
                .setLabel('Comment avez-vous perdu vos équipements ?')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true)
                .setPlaceholder("Expliquez les circonstances de la perte.");

            // Avez-vous vu un comportement anormal du serveur ? (optionnel)
            const serverIssueInput = new TextInputBuilder()
                .setCustomId('Comportement anormal du serveur')
                .setLabel('Comportement anormal du serveur ?')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(false)
                .setPlaceholder("Avez-vous vu un comportement anormal du serveur ?");

            components.push(
                new ActionRowBuilder<TextInputBuilder>().addComponents(serverWorldInput_remboursement),
                new ActionRowBuilder<TextInputBuilder>().addComponents(lossExplanationInput),
                new ActionRowBuilder<TextInputBuilder>().addComponents(serverIssueInput),
            );
            break;

        case 'contestation_sanction':
            // Pourquoi avez-vous été sanctionné ? (obligatoire)
            const sanctionReasonInput = new TextInputBuilder()
                .setCustomId('Raison de la sanction')
                .setLabel('Pourquoi avez-vous été sanctionné ?')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true)
                .setPlaceholder("Expliquez la raison de votre sanction.");

            // Pour quelle raison devrions-nous retirer votre sanction ? (optionnel)
            const appealReasonInput = new TextInputBuilder()
                .setCustomId('Raison du retrait de la sanction')
                .setLabel('Pour quelle raison retirer votre sanction ?')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(false)
                .setPlaceholder("Pour quelle raison devrions-nous retirer votre sanction ?");

            components.push(
                new ActionRowBuilder<TextInputBuilder>().addComponents(sanctionReasonInput),
                new ActionRowBuilder<TextInputBuilder>().addComponents(appealReasonInput),
            );
            break;

        case 'probleme_boutique':
            // Sur lequel de nos serveur et/ou monde êtes-vous ? (obligatoire)
            const serverWorldInput_boutique = new TextInputBuilder()
                .setCustomId('Serveur/Monde')
                .setLabel('Sur quel serveur/monde ?')
                .setStyle(TextInputStyle.Short)
                .setRequired(false)
                .setPlaceholder("Sur lequel de nos serveur et/ou monde êtes-vous ?");

            // Quels articles avez-vous acheté(s) ? (obligatoire)
            const purchasedItemsInput = new TextInputBuilder()
                .setCustomId('Articles achetés')
                .setLabel('Articles achetés')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true)
                .setPlaceholder("Listez les articles achetés.");

            // Quel est le problème rencontré ? (optionnel)
            const issueDescriptionInput = new TextInputBuilder()
                .setCustomId('Description du problème')
                .setLabel('Quel est le problème rencontré ?')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(false)
                .setPlaceholder("Décrivez le problème rencontré.");

            components.push(
                new ActionRowBuilder<TextInputBuilder>().addComponents(serverWorldInput_boutique),
                new ActionRowBuilder<TextInputBuilder>().addComponents(purchasedItemsInput),
                new ActionRowBuilder<TextInputBuilder>().addComponents(issueDescriptionInput),
            );
            break;

        case 'intervention':
            // Sur lequel de nos serveur et/ou monde ? (obligatoire)
            const serverWorldInput_intervention = new TextInputBuilder()
                .setCustomId('Serveur/Monde')
                .setLabel('Sur quel serveur/monde ?')
                .setStyle(TextInputStyle.Short)
                .setRequired(false)
                .setPlaceholder("Sur lequel de nos serveur et/ou monde ?");

            // Pourquoi avez-vous besoin d'une intervention Haut Staff ? (obligatoire)
            const interventionReasonInput = new TextInputBuilder()
                .setCustomId('Raison de l\'intervention')
                .setLabel('Pourquoi une intervention Haut Staff ?')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true)
                .setPlaceholder("Pourquoi avez-vous besoin d'une intervention Haut Staff ?");

            components.push(
                new ActionRowBuilder<TextInputBuilder>().addComponents(serverWorldInput_intervention),
                new ActionRowBuilder<TextInputBuilder>().addComponents(interventionReasonInput),
            );
            break;

        case 'partenariats':
            // Présentez-nous votre projet (obligatoire)
            const projectPresentationInput = new TextInputBuilder()
                .setCustomId('Présentation du projet')
                .setLabel('Présentez-nous votre projet')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true)
                .setPlaceholder("Décrivez votre projet en détail.");

            components.push(
                new ActionRowBuilder<TextInputBuilder>().addComponents(projectPresentationInput),
            );
            break;

        default:
            // Catégorie inconnue, utiliser le formulaire par défaut
            const defaultReasonInput = new TextInputBuilder()
                .setCustomId('Raison du ticket')
                .setLabel('Raison du ticket')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true)
                .setPlaceholder("Entrez la raison de votre demande. N'oubliez pas la politesse !");

            components.push(new ActionRowBuilder<TextInputBuilder>().addComponents(defaultReasonInput));
            break;
    }

    modal.addComponents(...components);

    return modal;
}

// Fonction pour récupérer les valeurs des champs de la modale en fonction de la catégorie
function getModalFieldsForCategory(category: string, interaction: any): { [key: string]: string } {
    const fields: { [key: string]: string } = {};

    // Pseudo en jeu (commun)
    fields['Pseudo en jeu'] = interaction.fields.getTextInputValue('Pseudo en jeu');

    switch (category) {
        case 'signalement_bug':
            fields['Serveur/Monde'] = interaction.fields.getTextInputValue('Serveur/Monde');
            fields['Description du bug'] = interaction.fields.getTextInputValue('Description du bug');
            fields['Comment reproduire le bug'] = interaction.fields.getTextInputValue('Comment reproduire le bug') || 'Non spécifié';
            fields['Erreur dans le tchat'] = interaction.fields.getTextInputValue('Erreur dans le tchat') || 'Non spécifié';
            break;

        case 'plainte':
            fields['Serveur/Monde'] = interaction.fields.getTextInputValue('Serveur/Monde');
            fields['Pseudo du/des fautif(s)'] = interaction.fields.getTextInputValue('Pseudo du/des fautif(s)');
            fields['Description du problème'] = interaction.fields.getTextInputValue('Description du problème');
            break;

        case 'questions_aide':
            fields['Serveur/Monde'] = interaction.fields.getTextInputValue('Serveur/Monde');
            fields['Votre demande'] = interaction.fields.getTextInputValue('Votre demande');
            break;

        case 'remboursements':
            fields['Serveur/Monde'] = interaction.fields.getTextInputValue('Serveur/Monde');
            fields['Comment avez-vous perdu vos équipements ?'] = interaction.fields.getTextInputValue('Comment avez-vous perdu vos équipements');
            fields['Comportement anormal du serveur ?'] = interaction.fields.getTextInputValue('Comportement anormal du serveur') || 'Non spécifié';
            break;

        case 'contestation_sanction':
            fields['Pourquoi avez-vous été sanctionné ?'] = interaction.fields.getTextInputValue('Raison de la sanction');
            fields['Pourquoi retirer votre sanction ?'] = interaction.fields.getTextInputValue('Raison du retrait de la sanction') || 'Non spécifié';
            break;

        case 'probleme_boutique':
            fields['Serveur/Monde'] = interaction.fields.getTextInputValue('Serveur/Monde');
            fields['Articles achetés'] = interaction.fields.getTextInputValue('Articles achetés');
            fields['Description du problème'] = interaction.fields.getTextInputValue('Description du problème') || 'Non spécifié';
            break;

        case 'intervention':
            fields['Serveur/Monde'] = interaction.fields.getTextInputValue('Serveur/Monde');
            fields['Pourquoi une intervention Haut Staff ?'] = interaction.fields.getTextInputValue('Raison de l\'intervention');
            break;

        case 'partenariats':
            fields['Présentation du projet'] = interaction.fields.getTextInputValue('Présentation du projet');
            break;

        default:
            fields['Raison du ticket'] = interaction.fields.getTextInputValue('Raison du ticket');
            break;
    }

    return fields;
}

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

// Fonction pour formater les messages pour le transcript
function formatMessage(message: Message): string {
    const author = `${message.author.tag}`;
    let content = message.content || '';

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
