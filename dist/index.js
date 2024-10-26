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
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        // GatewayIntentBits.MessageContent, // Intention non utilisée
    ],
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
            }, {
                label: 'Questions & Aide',
                value: 'questions_aide',
            }, {
                label: 'Plainte',
                value: 'plainte',
            }, {
                label: 'Remboursements',
                value: 'remboursements',
            }, {
                label: 'Signalement de bug',
                value: 'signalement_bug',
            }, {
                label: 'Contestation de sanction',
                value: 'contestation_sanction',
            }, {
                label: 'Problème boutique',
                value: 'probleme_boutique',
            }, {
                label: 'Intervention',
                value: 'intervention',
            });
            const row = new discord_js_1.ActionRowBuilder().addComponents(selectMenu);
            // Utilisation d'un embed pour le message
            const embed = new discord_js_1.EmbedBuilder()
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
            // Créer la modale
            const modal = new discord_js_1.ModalBuilder()
                .setCustomId(`ticket_modal_${selectedCategory}`)
                .setTitle('Ouvrir un Ticket');
            // Champ pour le pseudo en jeu
            const usernameInput = new discord_js_1.TextInputBuilder()
                .setCustomId('username')
                .setLabel('Votre pseudo en jeu')
                .setStyle(discord_js_1.TextInputStyle.Short)
                .setRequired(true);
            // Champ pour la raison du ticket
            const reasonInput = new discord_js_1.TextInputBuilder()
                .setCustomId('reason')
                .setLabel('Raison du ticket')
                .setStyle(discord_js_1.TextInputStyle.Paragraph)
                .setRequired(true);
            // Ajouter les champs à la modale
            const modalRow1 = new discord_js_1.ActionRowBuilder().addComponents(usernameInput);
            const modalRow2 = new discord_js_1.ActionRowBuilder().addComponents(reasonInput);
            modal.addComponents(modalRow1, modalRow2);
            yield interaction.showModal(modal);
        }
    }
    else if (interaction.type === discord_js_1.InteractionType.ModalSubmit) {
        if (interaction.customId.startsWith('ticket_modal_')) {
            const username = interaction.fields.getTextInputValue('username');
            const reason = interaction.fields.getTextInputValue('reason');
            const selectedCategory = interaction.customId.replace('ticket_modal_', '');
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
                // Utilisation d'un embed pour le message du ticket
                const embed = new discord_js_1.EmbedBuilder()
                    .setTitle(`Nouveau ticket créé par ${interaction.user.tag}`)
                    .addFields({ name: 'Catégorie', value: selectedCategory, inline: true }, { name: 'Pseudo en jeu', value: username, inline: true }, { name: 'Raison du ticket', value: reason })
                    .setColor(0x00AE86)
                    .setTimestamp();
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
// Fonction pour formater les messages pour le transcript sans utiliser message.content des utilisateurs
function formatMessage(message) {
    const author = `${message.author.tag}`;
    let content = '';
    // Si le message est envoyé par le bot, nous avons accès à message.content
    if (message.author.bot) {
        content = message.content || '[Aucun contenu]';
    }
    else {
        content = '[Contenu du message indisponible]';
    }
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
