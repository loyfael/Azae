import { Client, ActivityType } from "discord.js";
import { client } from "..";

const util = require('minecraft-server-util');
const ip = 'play.nuvalis.fr';
const port = 25565;

/**
 * Get the number of players currently online on the Minecraft server.
 * @returns {Promise<number>} Number of players online.
 */
export async function getMinecraftPlayerCount(): Promise<number> {
    try {
        const response = await util(ip, port);
        return response.players.online;
    } catch (error) {
        console.error("Nuvalis est injoignable", error);
        return 0;
    }
}

export async function updateBotStatus(): Promise<void> {
    try {
        const playerCount = await getMinecraftPlayerCount();
        const statusMessage = `${playerCount} connecté(e)s 🌼`;

        if (!client.user) {
            console.warn("⚠️ client.user est null, impossible de définir le statut.");
            return;
        }

        await client.user.setPresence({
            activities: [{ name: statusMessage, type: ActivityType.Watching }],
            status: 'online',
        });

        console.log(`✅ Statut mis à jour : ${statusMessage}`);
    } catch (error) {
        console.error('❌ Erreur lors de la mise à jour du statut :', error);
    }
}

