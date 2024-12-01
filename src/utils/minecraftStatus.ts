// src/utils/minecraftStatus.ts

import { MinecraftStatusResponse } from '../interfaces/minecraftStatusInterface';

const MINECRAFT_STATUS_URL = 'https://api.mcstatus.io/v2/status/java/play.badlands.fr:25565';

/**
 * Récupère le nombre de joueurs en ligne sur le serveur Minecraft via l'API mcstatus.io.
 * @returns {Promise<number>} Nombre de joueurs en ligne
 */
export async function getMinecraftPlayerCount(): Promise<number> {
    try {
        const response = await fetch(MINECRAFT_STATUS_URL);

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status} - ${response.statusText}`);
        }

        const data: MinecraftStatusResponse = await response.json();

        // Vérifie si l'objet `players` et la propriété `online` existent et sont valides
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

