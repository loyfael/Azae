// src/utils/minecraftStatus.ts

import { MinecraftStatusResponse } from '../interfaces/minecraftStatusInterface';

const MINECRAFT_STATUS_URL = 'https://api.mcstatus.io/v2/status/java/play.badlands.fr:25565';

/**
 * Get the number of players currently online on the Minecraft server.
 * @returns {Promise<number>} Number of players online.
 */
export async function getMinecraftPlayerCount(): Promise<number> {
    try {
        const response = await fetch(MINECRAFT_STATUS_URL);

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status} - ${response.statusText}`);
        }

        const data: MinecraftStatusResponse = await response.json();

        // Verify that the response contains the expected data
        if (data && data.players && typeof data.players.online === 'number') {
            return data.players.online;
        } else {
            console.warn('Réponse inattendue ou incomplète:', data);
            return 0;
        }
    } catch (error) {
        console.error('Erreur lors de la récupération du statut du serveur Minecraft:', error);
        return 0;
    }
}

