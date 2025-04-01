import { StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from 'discord.js';

/**
 * Create a new StringSelectMenuBuilder with the categories options.
 * 
 * @returns {StringSelectMenuBuilder} An object representing the select menu.
 */
export function createSelectMenu() {
    // Create a new StringSelectMenuBuilder
    const selectMenu = new StringSelectMenuBuilder()
        .setCustomId('category_select') // Define the custom ID of the select menu.
        .setPlaceholder('Sélectionnez une catégorie') // Displayed when no option is selected.
        .addOptions(
            // Partnerships
            new StringSelectMenuOptionBuilder()
                .setLabel('PARTENARIATS') // Visible text of the option.
                .setValue('partenariats') // Send value when the option is selected.
                .setDescription("Devenir forgeur/euse d'art.") // Description of the option.
                .setEmoji('🤝'), // Associated emoji

            // Question and help
            new StringSelectMenuOptionBuilder()
                .setLabel('SUPPORT')
                .setValue('support')
                .setDescription("Pour les questions, bugs, demandes, remboursements etc.")
                .setEmoji('🛠️'),

            // Plaining 
            new StringSelectMenuOptionBuilder()
                .setLabel('MODÉRATION')
                .setValue('moderation')
                .setDescription("Pour signaler un joueur / contester / réclamer etc.")
                .setEmoji('🚨'),
        );

    // Retourne le menu de sélection entièrement configuré
    return selectMenu;
}

