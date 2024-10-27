"use strict";
// src/index.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// **Remplacez les valeurs ci-dessous par vos propres IDs**
const CHANNEL_ID = '1263546795586490419'; // ID du salon pour le menu de sélection
const CATEGORY_ID = '1263546795586490418'; // ID de la catégorie pour les tickets
const STAFF_ROLE_ID = '1263546795137437714'; // ID du rôle du staff
const TRANSCRIPT_CHANNEL_ID = '1299661497575931914'; // ID du salon où envoyer les transcripts
const client = new discord_js_1.Client({
    intents: [discord_js_1.GatewayIntentBits.Guilds, discord_js_1.GatewayIntentBits.GuildMessages],
    partials: [discord_js_1.Partials.Channel, discord_js_1.Partials.Message]
});
client.once(discord_js_1.Events.ClientReady, () => {
    var _a;
    console.log(`Connecté en tant que ${(_a = client.user) === null || _a === void 0 ? void 0 : _a.tag}`);
    sendSelectMenuMessage();
});
function sendSelectMenuMessage() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const channel = yield client.channels.fetch(CHANNEL_ID);
            if (!channel) {
                console.error('Salon non trouvé.');
                return;
            }
            const selectMenu = new discord_js_1.StringSelectMenuBuilder()
                .setCustomId('category_select')
                .setPlaceholder('Sélectionnez une catégorie')
                .addOptions({
                label: 'Partenariats',
                value: 'partenariats',
                description: "Je veux être partenaire.",
                emoji: "📹"
            }, {
                label: 'Questions & Aide',
                value: 'questions_aide',
                description: "J'ai une question | besoin d'aide.",
                emoji: "❓"
            }, {
                label: 'Plainte',
                value: 'plainte',
                description: "J'ai une plainte à déposer contre un joueur.",
                emoji: "😡"
            }, {
                label: 'Remboursements',
                value: 'remboursements',
                description: "J'ai perdu mon stuff à cause d'un bug.",
                emoji: "🎒"
            }, {
                label: 'Signalement de bug',
                value: 'signalement_bug',
                description: "Je veux signaler un bug.",
                emoji: "🐛"
            }, {
                label: 'Contestation de sanction',
                value: 'contestation_sanction',
                description: "Je veux contester une sanction",
                emoji: "🗣️"
            }, {
                label: 'Problème boutique',
                value: 'probleme_boutique',
                description: "J'ai eu un problème avec la boutique.",
                emoji: "💳"
            }, {
                label: 'Intervention',
                value: 'intervention',
                description: "J'ai besoin d'un unclaim, afficher au spawn..",
                emoji: "📩"
            });
            const row = new discord_js_1.ActionRowBuilder().addComponents(selectMenu);
            // Création de l'embed pour le message
            const embed = new discord_js_1.EmbedBuilder()
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
            yield channel.send({ embeds: [embed], components: [row] });
            console.log('Message avec le menu de sélection envoyé avec succès.');
        }
        catch (error) {
            console.error('Erreur lors de l\'envoi du message :', error);
        }
    });
}
client.on(discord_js_1.Events.InteractionCreate, (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    if (interaction.isStringSelectMenu()) {
        if (interaction.customId === 'category_select') {
            const selectedCategory = interaction.values[0];
            // Créer la modale spécifique en fonction de la catégorie
            const modal = createModalForCategory(selectedCategory);
            yield interaction.showModal(modal);
        }
    }
    else if (interaction.type === discord_js_1.InteractionType.ModalSubmit) {
        if (interaction.customId.startsWith('ticket_modal_')) {
            const selectedCategory = interaction.customId.replace('ticket_modal_', '');
            // Récupérer les valeurs des champs de la modale
            const fields = getModalFieldsForCategory(selectedCategory, interaction);
            // Créer un nouveau canal de ticket
            const guild = interaction.guild;
            if (!guild) {
                yield interaction.reply({ content: 'Impossible de créer un ticket en dehors d\'un serveur.', ephemeral: true });
                return;
            }
            try {
                const channelName = `ticket-${interaction.user.username}-${interaction.user.discriminator}`;
                const ticketChannel = yield guild.channels.create({
                    name: channelName,
                    type: discord_js_1.ChannelType.GuildText,
                    parent: CATEGORY_ID,
                    topic: interaction.user.id, // Stocke l'ID du créateur du ticket
                    permissionOverwrites: [
                        {
                            id: guild.id,
                            deny: [discord_js_1.PermissionFlagsBits.ViewChannel],
                        },
                        {
                            id: interaction.user.id,
                            allow: [discord_js_1.PermissionFlagsBits.ViewChannel, discord_js_1.PermissionFlagsBits.SendMessages, discord_js_1.PermissionFlagsBits.ReadMessageHistory],
                        },
                        {
                            id: STAFF_ROLE_ID,
                            allow: [discord_js_1.PermissionFlagsBits.ViewChannel, discord_js_1.PermissionFlagsBits.SendMessages, discord_js_1.PermissionFlagsBits.ReadMessageHistory],
                        },
                    ],
                });
                // Créer les boutons de réclamation et de fermeture
                const claimButton = new discord_js_1.ButtonBuilder()
                    .setCustomId('claim_ticket')
                    .setLabel('Réclamer le ticket')
                    .setStyle(discord_js_1.ButtonStyle.Primary)
                    .setEmoji('🛠️');
                const closeButton = new discord_js_1.ButtonBuilder()
                    .setCustomId('close_ticket')
                    .setLabel('Fermer le ticket')
                    .setStyle(discord_js_1.ButtonStyle.Danger)
                    .setEmoji('❌');
                const buttonRow = new discord_js_1.ActionRowBuilder().addComponents(claimButton, closeButton);
                // Créer l'embed pour le message du ticket
                const embed = new discord_js_1.EmbedBuilder()
                    .setTitle(`Nouveau ticket créé par ${interaction.user.tag}`)
                    .setColor(0x00AE86)
                    .setTimestamp();
                // Ajouter les champs au message du ticket
                embed.addFields({ name: 'Catégorie', value: selectedCategory, inline: true });
                for (const fieldName in fields) {
                    embed.addFields({ name: fieldName, value: fields[fieldName], inline: false });
                }
                // Envoyer le message dans le canal du ticket avec les boutons
                yield ticketChannel.send({
                    embeds: [embed],
                    components: [buttonRow],
                });
                // Envoyer un message de confirmation à l'utilisateur
                yield interaction.reply({ content: `Votre ticket a été créé : ${ticketChannel}`, ephemeral: true });
            }
            catch (error) {
                console.error('Erreur lors de la création du canal de ticket :', error);
                yield interaction.reply({ content: 'Une erreur est survenue lors de la création de votre ticket.', ephemeral: true });
            }
        }
        else if (interaction.customId === 'close_ticket_modal') {
            const channel = interaction.channel;
            if (!channel || !channel.name.startsWith('ticket-')) {
                yield interaction.reply({ content: 'Cette action ne peut être effectuée que dans un canal de ticket.', ephemeral: true });
                return;
            }
            const member = interaction.member;
            const isStaff = (member === null || member === void 0 ? void 0 : member.roles).cache.has(STAFF_ROLE_ID);
            const isTicketOwner = channel.topic === interaction.user.id;
            if (!isStaff && !isTicketOwner) {
                yield interaction.reply({ content: 'Vous n\'avez pas la permission de fermer ce ticket.', ephemeral: true });
                return;
            }
            const closeReason = interaction.fields.getTextInputValue('close_reason') || 'Aucun motif fourni.';
            // Envoyer le transcript
            try {
                const messages = yield fetchChannelMessages(channel);
                const transcript = messages.reverse().map(formatMessage).join('\n');
                const attachment = new discord_js_1.AttachmentBuilder(Buffer.from(transcript, 'utf-8'), { name: `transcript-${channel.name}.txt` });
                const transcriptChannel = yield client.channels.fetch(TRANSCRIPT_CHANNEL_ID);
                if (transcriptChannel) {
                    yield transcriptChannel.send({ content: `Transcript du ticket ${channel.name} fermé par ${interaction.user}\nMotif : ${closeReason}`, files: [attachment] });
                }
            }
            catch (error) {
                console.error('Erreur lors de la création du transcript :', error);
            }
            yield interaction.reply({ content: `Ticket fermé par ${interaction.user}\nMotif : ${closeReason}` });
            setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                yield channel.delete().catch(console.error);
            }), 5000);
        }
    }
    else if (interaction.isButton()) {
        const channel = interaction.channel;
        if (!channel || !channel.name.startsWith('ticket-')) {
            yield interaction.reply({ content: 'Ce bouton ne peut être utilisé que dans un canal de ticket.', ephemeral: true });
            return;
        }
        if (interaction.customId === 'claim_ticket') {
            // Vérifier si l'utilisateur a le rôle du staff
            const member = interaction.member;
            const isStaff = (member === null || member === void 0 ? void 0 : member.roles).cache.has(STAFF_ROLE_ID);
            if (!isStaff) {
                yield interaction.reply({ content: 'Vous n\'avez pas la permission de réclamer ce ticket.', ephemeral: true });
                return;
            }
            // Ajouter une permission pour le membre
            yield channel.permissionOverwrites.edit(interaction.user.id, {
                ViewChannel: true,
                SendMessages: true,
                ReadMessageHistory: true,
            });
            yield interaction.reply({ content: `${interaction.user} a réclamé le ticket et va désormais s'occuper de vous. Merci pour votre patience.` });
        }
        else if (interaction.customId === 'close_ticket') {
            // Ajouter une modale pour le motif de fermeture
            const reasonModal = new discord_js_1.ModalBuilder()
                .setCustomId('close_ticket_modal')
                .setTitle('Motif de fermeture du ticket');
            const reasonInput = new discord_js_1.TextInputBuilder()
                .setCustomId('close_reason')
                .setLabel('Motif de fermeture')
                .setStyle(discord_js_1.TextInputStyle.Paragraph)
                .setRequired(false);
            const modalRow = new discord_js_1.ActionRowBuilder().addComponents(reasonInput);
            reasonModal.addComponents(modalRow);
            yield interaction.showModal(reasonModal);
        }
    }
}));
// Fonction pour créer la modale en fonction de la catégorie
function createModalForCategory(category) {
    const modal = new discord_js_1.ModalBuilder()
        .setCustomId(`ticket_modal_${category}`)
        .setTitle('Ouvrir un Ticket');
    const components = [];
    // Champ commun : Pseudo en jeu (obligatoire)
    const usernameInput = new discord_js_1.TextInputBuilder()
        .setCustomId('Pseudo en jeu')
        .setLabel('Votre pseudo en jeu')
        .setStyle(discord_js_1.TextInputStyle.Short)
        .setRequired(true)
        .setPlaceholder("Entrez votre pseudo en jeu.");
    components.push(new discord_js_1.ActionRowBuilder().addComponents(usernameInput));
    switch (category) {
        case 'signalement_bug':
            // Sur lequel de nos serveur et/ou monde ? (obligatoire)
            const serverWorldInput_bug = new discord_js_1.TextInputBuilder()
                .setCustomId('Serveur/Monde')
                .setLabel('Sur quel serveur/monde ?')
                .setStyle(discord_js_1.TextInputStyle.Short)
                .setRequired(false)
                .setPlaceholder("Sur lequel de nos serveur et/ou monde ?");
            // Description du bug (obligatoire)
            const bugDescriptionInput = new discord_js_1.TextInputBuilder()
                .setCustomId('Description du bug')
                .setLabel('Description du bug')
                .setStyle(discord_js_1.TextInputStyle.Paragraph)
                .setRequired(true)
                .setPlaceholder("Quel bug avez-vous rencontré(e) ?");
            // Comment reproduire le bug? (optionnel)
            const reproduceBugInput = new discord_js_1.TextInputBuilder()
                .setCustomId('Comment reproduire le bug')
                .setLabel('Comment reproduire le bug ?')
                .setStyle(discord_js_1.TextInputStyle.Paragraph)
                .setRequired(false)
                .setPlaceholder("Expliquez-nous comment reproduire ce bug.");
            // Erreur dans le tchat (optionnel)
            const chatErrorInput = new discord_js_1.TextInputBuilder()
                .setCustomId('Erreur dans le tchat')
                .setLabel('Erreur dans le tchat')
                .setStyle(discord_js_1.TextInputStyle.Paragraph)
                .setRequired(false)
                .setPlaceholder("Écrivez l'erreur si il y en a une.");
            components.push(new discord_js_1.ActionRowBuilder().addComponents(serverWorldInput_bug), new discord_js_1.ActionRowBuilder().addComponents(bugDescriptionInput), new discord_js_1.ActionRowBuilder().addComponents(reproduceBugInput), new discord_js_1.ActionRowBuilder().addComponents(chatErrorInput));
            break;
        case 'plainte':
            // Sur lequel de nos serveur et/ou monde ? (obligatoire)
            const serverWorldInput_plainte = new discord_js_1.TextInputBuilder()
                .setCustomId('Serveur/Monde')
                .setLabel('Sur quel serveur/monde ?')
                .setStyle(discord_js_1.TextInputStyle.Short)
                .setRequired(false)
                .setPlaceholder("Sur lequel de nos serveur et/ou monde ?");
            // Pseudo du/des fautif(s) (obligatoire)
            const offenderInput = new discord_js_1.TextInputBuilder()
                .setCustomId('Pseudo du/des fautif(s)')
                .setLabel('Pseudo du/des fautif(s)')
                .setStyle(discord_js_1.TextInputStyle.Short)
                .setRequired(true)
                .setPlaceholder("Entrez le(s) pseudo(s) du/des fautif(s).");
            // Description du problème (obligatoire)
            const problemDescriptionInput = new discord_js_1.TextInputBuilder()
                .setCustomId('Description du problème')
                .setLabel('Description du problème')
                .setStyle(discord_js_1.TextInputStyle.Paragraph)
                .setRequired(true)
                .setPlaceholder("Décrivez le problème rencontré.");
            components.push(new discord_js_1.ActionRowBuilder().addComponents(serverWorldInput_plainte), new discord_js_1.ActionRowBuilder().addComponents(offenderInput), new discord_js_1.ActionRowBuilder().addComponents(problemDescriptionInput));
            break;
        case 'questions_aide':
            // Sur lequel de nos serveur et/ou monde ? (obligatoire)
            const serverWorldInput_aide = new discord_js_1.TextInputBuilder()
                .setCustomId('Serveur/Monde')
                .setLabel('Sur quel serveur/monde ?')
                .setStyle(discord_js_1.TextInputStyle.Short)
                .setRequired(false)
                .setPlaceholder("Sur lequel de nos serveur et/ou monde ?");
            // De quoi avez-vous besoin ? (obligatoire)
            const needInput = new discord_js_1.TextInputBuilder()
                .setCustomId('Votre demande')
                .setLabel('De quoi avez-vous besoin ?')
                .setStyle(discord_js_1.TextInputStyle.Paragraph)
                .setRequired(true)
                .setPlaceholder("Expliquez votre besoin.");
            components.push(new discord_js_1.ActionRowBuilder().addComponents(serverWorldInput_aide), new discord_js_1.ActionRowBuilder().addComponents(needInput));
            break;
        case 'remboursements':
            // Sur lequel de nos serveur et/ou monde ? (obligatoire)
            const serverWorldInput_remboursement = new discord_js_1.TextInputBuilder()
                .setCustomId('Serveur/Monde')
                .setLabel('Sur quel serveur/monde ?')
                .setStyle(discord_js_1.TextInputStyle.Short)
                .setRequired(false)
                .setPlaceholder("Sur lequel de nos serveur et/ou monde ?");
            // Comment avez-vous perdu vos équipements ? (obligatoire)
            const lossExplanationInput = new discord_js_1.TextInputBuilder()
                .setCustomId('Comment avez-vous perdu vos équipements')
                .setLabel('Comment avez-vous perdu vos équipements ?')
                .setStyle(discord_js_1.TextInputStyle.Paragraph)
                .setRequired(true)
                .setPlaceholder("Expliquez les circonstances de la perte.");
            // Avez-vous vu un comportement anormal du serveur ? (optionnel)
            const serverIssueInput = new discord_js_1.TextInputBuilder()
                .setCustomId('Comportement anormal du serveur')
                .setLabel('Comportement anormal du serveur ?')
                .setStyle(discord_js_1.TextInputStyle.Paragraph)
                .setRequired(false)
                .setPlaceholder("Avez-vous vu un comportement anormal du serveur ?");
            components.push(new discord_js_1.ActionRowBuilder().addComponents(serverWorldInput_remboursement), new discord_js_1.ActionRowBuilder().addComponents(lossExplanationInput), new discord_js_1.ActionRowBuilder().addComponents(serverIssueInput));
            break;
        case 'contestation_sanction':
            // Pourquoi avez-vous été sanctionné ? (obligatoire)
            const sanctionReasonInput = new discord_js_1.TextInputBuilder()
                .setCustomId('Raison de la sanction')
                .setLabel('Pourquoi avez-vous été sanctionné ?')
                .setStyle(discord_js_1.TextInputStyle.Paragraph)
                .setRequired(true)
                .setPlaceholder("Expliquez la raison de votre sanction.");
            // Pour quelle raison devrions-nous retirer votre sanction ? (optionnel)
            const appealReasonInput = new discord_js_1.TextInputBuilder()
                .setCustomId('Raison du retrait de la sanction')
                .setLabel('Pour quelle raison retirer votre sanction ?')
                .setStyle(discord_js_1.TextInputStyle.Paragraph)
                .setRequired(false)
                .setPlaceholder("Pour quelle raison devrions-nous retirer votre sanction ?");
            components.push(new discord_js_1.ActionRowBuilder().addComponents(sanctionReasonInput), new discord_js_1.ActionRowBuilder().addComponents(appealReasonInput));
            break;
        case 'probleme_boutique':
            // Sur lequel de nos serveur et/ou monde êtes-vous ? (obligatoire)
            const serverWorldInput_boutique = new discord_js_1.TextInputBuilder()
                .setCustomId('Serveur/Monde')
                .setLabel('Sur quel serveur/monde ?')
                .setStyle(discord_js_1.TextInputStyle.Short)
                .setRequired(false)
                .setPlaceholder("Sur lequel de nos serveur et/ou monde êtes-vous ?");
            // Quels articles avez-vous acheté(s) ? (obligatoire)
            const purchasedItemsInput = new discord_js_1.TextInputBuilder()
                .setCustomId('Articles achetés')
                .setLabel('Articles achetés')
                .setStyle(discord_js_1.TextInputStyle.Paragraph)
                .setRequired(true)
                .setPlaceholder("Listez les articles achetés.");
            // Quel est le problème rencontré ? (optionnel)
            const issueDescriptionInput = new discord_js_1.TextInputBuilder()
                .setCustomId('Description du problème')
                .setLabel('Quel est le problème rencontré ?')
                .setStyle(discord_js_1.TextInputStyle.Paragraph)
                .setRequired(false)
                .setPlaceholder("Décrivez le problème rencontré.");
            components.push(new discord_js_1.ActionRowBuilder().addComponents(serverWorldInput_boutique), new discord_js_1.ActionRowBuilder().addComponents(purchasedItemsInput), new discord_js_1.ActionRowBuilder().addComponents(issueDescriptionInput));
            break;
        case 'intervention':
            // Sur lequel de nos serveur et/ou monde ? (obligatoire)
            const serverWorldInput_intervention = new discord_js_1.TextInputBuilder()
                .setCustomId('Serveur/Monde')
                .setLabel('Sur quel serveur/monde ?')
                .setStyle(discord_js_1.TextInputStyle.Short)
                .setRequired(false)
                .setPlaceholder("Sur lequel de nos serveur et/ou monde ?");
            // Pourquoi avez-vous besoin d'une intervention Haut Staff ? (obligatoire)
            const interventionReasonInput = new discord_js_1.TextInputBuilder()
                .setCustomId('Raison de l\'intervention')
                .setLabel('Pourquoi une intervention Haut Staff ?')
                .setStyle(discord_js_1.TextInputStyle.Paragraph)
                .setRequired(true)
                .setPlaceholder("Pourquoi avez-vous besoin d'une intervention Haut Staff ?");
            components.push(new discord_js_1.ActionRowBuilder().addComponents(serverWorldInput_intervention), new discord_js_1.ActionRowBuilder().addComponents(interventionReasonInput));
            break;
        case 'partenariats':
            // Présentez-nous votre projet (obligatoire)
            const projectPresentationInput = new discord_js_1.TextInputBuilder()
                .setCustomId('Présentation du projet')
                .setLabel('Présentez-nous votre projet')
                .setStyle(discord_js_1.TextInputStyle.Paragraph)
                .setRequired(true)
                .setPlaceholder("Décrivez votre projet en détail.");
            components.push(new discord_js_1.ActionRowBuilder().addComponents(projectPresentationInput));
            break;
        default:
            // Catégorie inconnue, utiliser le formulaire par défaut
            const defaultReasonInput = new discord_js_1.TextInputBuilder()
                .setCustomId('Raison du ticket')
                .setLabel('Raison du ticket')
                .setStyle(discord_js_1.TextInputStyle.Paragraph)
                .setRequired(true)
                .setPlaceholder("Entrez la raison de votre demande. N'oubliez pas la politesse !");
            components.push(new discord_js_1.ActionRowBuilder().addComponents(defaultReasonInput));
            break;
    }
    modal.addComponents(...components);
    return modal;
}
// Fonction pour récupérer les valeurs des champs de la modale en fonction de la catégorie
function getModalFieldsForCategory(category, interaction) {
    const fields = {};
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
function fetchChannelMessages(channel) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        let messages = [];
        let lastId;
        while (true) {
            const fetchedMessages = yield channel.messages.fetch({ limit: 100, before: lastId });
            if (fetchedMessages.size === 0) {
                break;
            }
            messages = messages.concat(Array.from(fetchedMessages.values()));
            lastId = (_a = fetchedMessages.last()) === null || _a === void 0 ? void 0 : _a.id;
        }
        return messages;
    });
}
// Fonction pour formater les messages pour le transcript
function formatMessage(message) {
    const author = `${message.author.tag}`;
    let content = message.content || '';
    // Si le message a des embeds, les inclure
    if (message.embeds.length > 0) {
        content += '\n[Embed]';
        message.embeds.forEach(embed => {
            if (embed.title)
                content += `\nTitre: ${embed.title}`;
            if (embed.description)
                content += `\nDescription: ${embed.description}`;
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
