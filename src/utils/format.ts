// Importation de la classe Message depuis discord.js
import { Message } from 'discord.js';

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
