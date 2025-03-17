import { ButtonBuilder, ButtonStyle } from 'discord.js';

/**
 * Create a button to claim a ticket.
 * 
 * @returns {ButtonBuilder} Object representing the button "Claim ticket".
 */
export function createClaimButton(): ButtonBuilder {
    return new ButtonBuilder()
        .setCustomId('claim_ticket') // Define a unique ID for the button, used to identify the interaction.
        .setLabel('Réclamer le ticket') // Define the text displayed on the button.
        .setStyle(ButtonStyle.Primary) // Define the style of the button (Primary is usually blue).
        .setEmoji('🛠️'); // Add emoji
}

/**
 * Create a button to close a ticket.
 * 
 * @returns {ButtonBuilder} ButtonBuilder Object.
 */
export function createCloseButton(): ButtonBuilder {
    return new ButtonBuilder()
        .setCustomId('close_ticket') // Define a unique ID for the button, used to identify the interaction.
        .setLabel('Fermer le ticket') // Define the text displayed on the button.
        .setStyle(ButtonStyle.Danger) // Define the style of the button (Danger is usually red).
        .setEmoji('❌'); // Add emoji
}
