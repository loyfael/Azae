import { Guild, PermissionFlagsBits, Snowflake } from 'discord.js';
import {
    GAME_DEV_ROLE_ID,
    MODO_ROLE_ID,
    SUPERMODO_ROLE_ID,
    GUIDE_ROLE_ID,
    HIGHER_ROLES_IDS
} from '../config/config';

/**
 * Generate the permissions to apply to a ticket channel based on the ticket name.
 * 
 * @param ticketName - Name of the ticket channel.
 * @param guild - Guild where the ticket is created.
 * @param creatorId - ID of the ticket creator.
 * @returns List of permission overwrites to apply to the ticket channel.
 */
export function getPermissionsBasedOnTicketName(ticketName: string, guild: Guild, creatorId: Snowflake) {
    const permissionOverwrites: Array<{ id: Snowflake; allow?: bigint[]; deny?: bigint[] }> = [
        {
            id: guild.id, // ID @everyone
            deny: [PermissionFlagsBits.ViewChannel],
        },
        {
            id: creatorId, // Permit the creator to view the channel
            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
        },
    ];

    console.log("Validation des rôles...");

    // Prefix matching for ticket categories
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

    // Add higher roles
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
