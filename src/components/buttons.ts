import { ButtonBuilder, ButtonStyle } from 'discord.js';

/**
 * Crée un bouton pour réclamer un ticket.
 * 
 * @returns {ButtonBuilder} Un objet ButtonBuilder configuré pour le bouton "Réclamer le ticket".
 */
export function createClaimButton(): ButtonBuilder {
    return new ButtonBuilder()
        .setCustomId('claim_ticket') // Définit un identifiant unique pour le bouton, utilisé pour identifier l'interaction.
        .setLabel('Réclamer le ticket') // Définit le texte affiché sur le bouton.
        .setStyle(ButtonStyle.Primary) // Définit le style du bouton (Primary correspond généralement à une couleur bleue).
        .setEmoji('🛠️'); // Ajoute un emoji au bouton pour une meilleure visibilité et compréhension.
}

/**
 * Crée un bouton pour fermer un ticket.
 * 
 * @returns {ButtonBuilder} Un objet ButtonBuilder configuré pour le bouton "Fermer le ticket".
 */
export function createCloseButton(): ButtonBuilder {
    return new ButtonBuilder()
        .setCustomId('close_ticket') // Définit un identifiant unique pour le bouton, utilisé pour identifier l'interaction.
        .setLabel('Fermer le ticket') // Définit le texte affiché sur le bouton.
        .setStyle(ButtonStyle.Danger) // Définit le style du bouton (Danger correspond généralement à une couleur rouge).
        .setEmoji('❌'); // Ajoute un emoji au bouton pour indiquer l'action de fermeture.
}
