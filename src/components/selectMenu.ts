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
                .setLabel('Partenariats') // Visible text of the option.
                .setValue('partenariats') // Send value when the option is selected.
                .setDescription("Je veux être partenaire.") // Description of the option.
                .setEmoji('🎙️'), // Associated emoji

            // Question and help
            new StringSelectMenuOptionBuilder()
                .setLabel('Questions & Aide')
                .setValue('questions_aide')
                .setDescription("J'ai une question | besoin d'aide.")
                .setEmoji('❓'),

            // Plaining 
            new StringSelectMenuOptionBuilder()
                .setLabel('Plainte')
                .setValue('plainte')
                .setDescription("J'ai une plainte à déposer contre un joueur.")
                .setEmoji('😡'),

            // Refund
            new StringSelectMenuOptionBuilder()
                .setLabel('Remboursements')
                .setValue('remboursements')
                .setDescription("J'ai perdu mon stuff à cause d'un bug.")
                .setEmoji('💰'),

            // Bug report
            new StringSelectMenuOptionBuilder()
                .setLabel('Signalement de bug')
                .setValue('signalement_bug')
                .setDescription("Je veux signaler un bug.")
                .setEmoji('🐛'),

            // Contest sanction
            new StringSelectMenuOptionBuilder()
                .setLabel('Contestation de sanction')
                .setValue('contestation_sanction')
                .setDescription("Je veux contester une sanction")
                .setEmoji('🗣️'),

            // Intervention
            new StringSelectMenuOptionBuilder()
                .setLabel('Intervention')
                .setValue('intervention')
                .setDescription("J'ai besoin d'un unclaim, afficher au spawn..")
                .setEmoji('⚡')
        );

    // Retourne le menu de sélection entièrement configuré
    return selectMenu;
}
