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
const GUILD_ID = '1263546794957078614'; // ID de votre serveur
const client = new discord_js_1.Client({
    intents: [discord_js_1.GatewayIntentBits.Guilds], // Retiré GatewayIntentBits.GuildMembers
    partials: [discord_js_1.Partials.Channel]
});
client.once(discord_js_1.Events.ClientReady, () => {
    var _a;
    console.log(`Connecté en tant que ${(_a = client.user) === null || _a === void 0 ? void 0 : _a.tag}`);
    sendSelectMenuMessage();
    registerCommands();
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
                label: 'Support Technique',
                description: 'Obtenez de l\'aide pour les problèmes techniques',
                value: 'support_technique',
            }, {
                label: 'Signalement de Bug',
                description: 'Signalez un bug rencontré en jeu',
                value: 'signalement_bug',
            }, {
                label: 'Autre',
                description: 'Pour toute autre demande',
                value: 'autre',
            });
            const row = new discord_js_1.ActionRowBuilder().addComponents(selectMenu);
            yield channel.send({ content: 'Veuillez sélectionner une catégorie pour votre ticket :', components: [row] });
            console.log('Message avec le menu de sélection envoyé avec succès.');
        }
        catch (error) {
            console.error('Erreur lors de l\'envoi du message :', error);
        }
    });
}
client.on(discord_js_1.Events.InteractionCreate, (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
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
                // Envoyer un message de confirmation à l'utilisateur
                yield interaction.reply({ content: `Votre ticket a été créé : ${ticketChannel}`, ephemeral: true });
                // Envoyer les détails du ticket dans le nouveau canal
                yield ticketChannel.send(`**Nouveau ticket créé par ${interaction.user}**

**Catégorie :** ${selectedCategory}
**Pseudo en jeu :** ${username}
**Raison du ticket :** ${reason}

Un membre du staff vous répondra dès que possible. Pour fermer ce ticket, utilisez la commande \`/fermer\`.`);
            }
            catch (error) {
                console.error('Erreur lors de la création du canal de ticket :', error);
                yield interaction.reply({ content: 'Une erreur est survenue lors de la création de votre ticket.', ephemeral: true });
            }
        }
    }
    else if (interaction.isChatInputCommand()) {
        if (interaction.commandName === 'fermer') {
            const channel = interaction.channel;
            if (!channel.name.startsWith('ticket-')) {
                yield interaction.reply({ content: 'Vous ne pouvez pas utiliser cette commande en dehors d\'un canal de ticket.', ephemeral: true });
                return;
            }
            // Vérifier si l'utilisateur a la permission de fermer le ticket
            if (interaction.user.id === ((_a = interaction.client.user) === null || _a === void 0 ? void 0 : _a.id) ||
                ((_b = channel.permissionsFor(interaction.user)) === null || _b === void 0 ? void 0 : _b.has(discord_js_1.PermissionFlagsBits.ManageChannels)) ||
                ((_c = channel.permissionsFor(interaction.user)) === null || _c === void 0 ? void 0 : _c.has(discord_js_1.PermissionFlagsBits.ManageMessages)) ||
                interaction.user.id === channel.name.split('-')[1] // Vérifie si l'utilisateur est le créateur du ticket
            ) {
                yield interaction.reply({ content: 'Ce ticket sera fermé dans 5 secondes.', ephemeral: true });
                setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                    yield channel.delete().catch(console.error);
                }), 5000);
            }
            else {
                yield interaction.reply({ content: 'Vous n\'avez pas la permission de fermer ce ticket.', ephemeral: true });
            }
        }
    }
}));
// Enregistrement de la commande "/fermer"
function registerCommands() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const guild = yield client.guilds.fetch(GUILD_ID);
            yield guild.commands.create({
                name: 'fermer',
                description: 'Ferme le ticket actuel',
            });
            console.log('Commande "/fermer" enregistrée avec succès.');
        }
        catch (error) {
            console.error('Erreur lors de l\'enregistrement de la commande :', error);
        }
    });
}
client.login(process.env.DISCORD_BOT_TOKEN);
