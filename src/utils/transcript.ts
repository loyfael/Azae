import { TextChannel, Message } from 'discord.js';

/**
 * Récupère tous les messages d'un salon de texte Discord.
 * 
 * Cette fonction parcourt un salon de texte et récupère tous les messages présents en paginant
 * les requêtes de messages en lots de 100 jusqu'à ce qu'il n'y ait plus de messages à récupérer.
 * 
 * @param {TextChannel} channel - Le salon de texte Discord dont les messages doivent être récupérés.
 * @returns {Promise<Message[]>} Une promesse résolvant un tableau contenant tous les messages du salon.
 * 
 * @throws {Error} Lance une erreur si la récupération des messages échoue.
 */
export async function fetchChannelMessages(channel: TextChannel): Promise<Message[]> {
    // Tableau pour stocker tous les messages récupérés
    let messages: Message[] = [];
    
    // ID du dernier message récupéré dans la boucle précédente
    let lastId: string | undefined;

    // Boucle infinie pour récupérer les messages en paginant jusqu'à ce qu'il n'y ait plus de messages
    while (true) {
        try {
            // Récupère un lot de 100 messages avant le message avec l'ID `lastId`
            const fetchedMessages = await channel.messages.fetch({ limit: 100, before: lastId });

            // Si aucun message n'est récupéré, sortir de la boucle
            if (fetchedMessages.size === 0) {
                break;
            }

            // Ajoute les messages récupérés au tableau `messages`
            messages = messages.concat(Array.from(fetchedMessages.values()));

            // Met à jour `lastId` avec l'ID du dernier message du lot actuel pour la prochaine itération
            lastId = fetchedMessages.last()?.id;
        } catch (error) {
            // Log l'erreur et arrête la boucle si une erreur survient lors de la récupération des messages
            console.error('Erreur lors de la récupération des messages :', error);
            break;
        }
    }

    // Retourne tous les messages récupérés
    return messages;
}
