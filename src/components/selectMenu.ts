import { StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from 'discord.js';

/**
 * Crée un menu de sélection (Select Menu) pour choisir une catégorie de ticket.
 * 
 * @returns {StringSelectMenuBuilder} Un objet StringSelectMenuBuilder configuré avec les options de catégories.
 */
export function createSelectMenu() {
    // Création d'une nouvelle instance de StringSelectMenuBuilder
    const selectMenu = new StringSelectMenuBuilder()
        .setCustomId('category_select') // Définit un identifiant unique pour le menu de sélection, utilisé pour identifier l'interaction.
        .setPlaceholder('Sélectionnez une catégorie') // Texte affiché par défaut lorsqu'aucune option n'est sélectionnée.
        .addOptions(
            // Ajout de la première option : Partenariats
            new StringSelectMenuOptionBuilder()
                .setLabel('Partenariats') // Texte visible de l'option.
                .setValue('partenariats') // Valeur envoyée lorsqu'une option est sélectionnée.
                .setDescription("Je veux être partenaire.") // Description de l'option pour fournir plus de contexte.
                .setEmoji('📹'), // Emoji associé à l'option pour une meilleure visibilité.

            // Ajout de la deuxième option : Questions & Aide
            new StringSelectMenuOptionBuilder()
                .setLabel('Questions & Aide')
                .setValue('questions_aide')
                .setDescription("J'ai une question | besoin d'aide.")
                .setEmoji('❓'),

            // Ajout de la troisième option : Plainte
            new StringSelectMenuOptionBuilder()
                .setLabel('Plainte')
                .setValue('plainte')
                .setDescription("J'ai une plainte à déposer contre un joueur.")
                .setEmoji('😡'),

            // Ajout de la quatrième option : Remboursements
            new StringSelectMenuOptionBuilder()
                .setLabel('Remboursements')
                .setValue('remboursements')
                .setDescription("J'ai perdu mon stuff à cause d'un bug.")
                .setEmoji('🎒'),

            // Ajout de la cinquième option : Signalement de bug
            new StringSelectMenuOptionBuilder()
                .setLabel('Signalement de bug')
                .setValue('signalement_bug')
                .setDescription("Je veux signaler un bug.")
                .setEmoji('🐛'),

            // Ajout de la sixième option : Contestation de sanction
            new StringSelectMenuOptionBuilder()
                .setLabel('Contestation de sanction')
                .setValue('contestation_sanction')
                .setDescription("Je veux contester une sanction")
                .setEmoji('🗣️'),

            // Ajout de la septième option : Intervention
            new StringSelectMenuOptionBuilder()
                .setLabel('Intervention')
                .setValue('intervention')
                .setDescription("J'ai besoin d'un unclaim, afficher au spawn..")
                .setEmoji('📩')
        );

    // Retourne le menu de sélection entièrement configuré
    return selectMenu;
}
