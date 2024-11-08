// src/utils/minecraftStatus.ts

import { MinecraftStatusResponse } from '../interfaces/minecraftStatusInterface';

const MINECRAFT_STATUS_URL = 'https://api.mcstatus.io/v2/status/java/play.badlands.fr';

/**
 * Récupère le nombre de joueurs en ligne sur le serveur Minecraft via l'API mcstatus.io.
 * @returns {Promise<number>} Nombre de joueurs en ligne
 */
export async function getMinecraftPlayerCount(): Promise<number> {
    try {
        const response = await fetch(MINECRAFT_STATUS_URL);
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data: MinecraftStatusResponse = (await response.json()) as MinecraftStatusResponse;
        return data.players.online;
    } catch (error) {
        console.error('Erreur lors de la récupération du statut du serveur Minecraft:', error);
        return 0; // Retourne 0 en cas d'erreur
    }
}
