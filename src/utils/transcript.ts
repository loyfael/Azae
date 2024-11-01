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

/**
 * Formate un message Discord en une chaîne de caractères lisible.
 * 
 * Cette fonction est utilisée pour créer des transcripts de salons de tickets en
 * convertissant les messages Discord en une représentation textuelle simple.
 * Elle inclut le contenu du message, les embeds et les pièces jointes.
 * 
 * @param {Message} message - Le message Discord à formater.
 * @returns {string} La représentation textuelle formatée du message.
 */
export function formatMessage(message: Message): string {
    // Récupère le tag de l'auteur du message (par exemple, "Username#1234")
    const author = `${message.author.tag}`;
    
    // Initialise le contenu du message avec le texte du message ou une chaîne vide si aucun contenu
    let content = message.content || '';

    // Vérifie si le message contient des embeds et les inclut dans le contenu formaté
    if (message.embeds.length > 0) {
        content += '\n[Embed]'; // Indique la présence d'un embed

        // Parcourt chaque embed dans le message
        message.embeds.forEach(embed => {
            // Si l'embed a un titre, l'ajoute au contenu
            if (embed.title) content += `\nTitre: ${embed.title}`;
            
            // Si l'embed a une description, l'ajoute au contenu
            if (embed.description) content += `\nDescription: ${embed.description}`;
            
            // Si l'embed a des champs, les ajoute au contenu
            if (embed.fields) {
                embed.fields.forEach(field => {
                    content += `\n${field.name}: ${field.value}`;
                });
            }
        });
    }

    // Vérifie si le message contient des pièces jointes et les inclut dans le contenu formaté
    if (message.attachments.size > 0) {
        content += '\n[Pièces jointes]'; // Indique la présence de pièces jointes

        // Parcourt chaque pièce jointe dans le message
        message.attachments.forEach(attachment => {
            content += `\n${attachment.url}`; // Ajoute l'URL de la pièce jointe au contenu
        });
    }

    // Retourne la chaîne formatée avec l'auteur et le contenu du message
    return `${author}: ${content}`;
}
