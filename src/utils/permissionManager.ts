import { Guild, PermissionFlagsBits, Snowflake } from 'discord.js';
import {
    GAME_DEV_ROLE_ID,
    MODO_ROLE_ID,
    SUPERMODO_ROLE_ID,
    GUIDE_ROLE_ID,
    HIGHER_ROLES_IDS
} from '../config/config';

/**
 * Génère les permissions pour un canal de ticket en fonction de son nom.
 * 
 * @param ticketName - Nom du ticket pour déterminer les rôles autorisés.
 * @param guild - Instance de la guilde Discord.
 * @param creatorId - ID de l'utilisateur qui a créé le ticket.
 * @returns Liste des permissions à appliquer au canal.
 */
export function getPermissionsBasedOnTicketName(ticketName: string, guild: Guild, creatorId: Snowflake) {
    const permissionOverwrites: Array<{ id: Snowflake; allow?: bigint[]; deny?: bigint[] }> = [
        {
            id: guild.id, // ID de @everyone
            deny: [PermissionFlagsBits.ViewChannel],
        },
        {
            id: creatorId, // Permet au créateur du ticket de voir et interagir dans le canal
            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
        },
    ];

    console.log("Validation des rôles...");

    // Match des préfixes pour déterminer les rôles autorisés
    if (ticketName.startsWith('bug')) {
        if (guild.roles.cache.has(GAME_DEV_ROLE_ID)) {
            permissionOverwrites.push({
                id: GAME_DEV_ROLE_ID,
                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
            });
        }
    } else if (ticketName.startsWith('plainte')) {
        if (guild.roles.cache.has(MODO_ROLE_ID)) {
            permissionOverwrites.push({
                id: MODO_ROLE_ID,
                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
            });
        }
        if (guild.roles.cache.has(SUPERMODO_ROLE_ID)) {
            permissionOverwrites.push({
                id: SUPERMODO_ROLE_ID,
                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
            });
        }
    } else if (ticketName.startsWith('refund')) {
        if (guild.roles.cache.has(GAME_DEV_ROLE_ID)) {
            permissionOverwrites.push({
                id: GAME_DEV_ROLE_ID,
                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
            });
        }
    } else if (ticketName.startsWith('protest')) {
        if (guild.roles.cache.has(MODO_ROLE_ID)) {
            permissionOverwrites.push({
                id: MODO_ROLE_ID,
                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
            });
        }
        if (guild.roles.cache.has(SUPERMODO_ROLE_ID)) {
            permissionOverwrites.push({
                id: SUPERMODO_ROLE_ID,
                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
            });
        }
    } else if (ticketName.startsWith('question')) {
        if (guild.roles.cache.has(GAME_DEV_ROLE_ID)) {
            permissionOverwrites.push({
                id: GAME_DEV_ROLE_ID,
                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
            });
        }
        
        if (guild.roles.cache.has(GUIDE_ROLE_ID)) {
            permissionOverwrites.push({
                id: GUIDE_ROLE_ID,
                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
            });
        }

        if (guild.roles.cache.has(MODO_ROLE_ID)) {
            permissionOverwrites.push({
                id: MODO_ROLE_ID,
                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
            });
        }

        if (guild.roles.cache.has(SUPERMODO_ROLE_ID)) {
            permissionOverwrites.push({
                id: SUPERMODO_ROLE_ID,
                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
            });
        }
    }

    // Ajouter les rôles supérieurs uniquement s'ils existent
    HIGHER_ROLES_IDS.forEach((roleId) => {
        if (guild.roles.cache.has(roleId)) {
            permissionOverwrites.push({
                id: roleId,
                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
            });
        } else {
            console.warn(`Rôle supérieur invalide ou inexistant : ${roleId}`);
        }
    });

    return permissionOverwrites;
}
