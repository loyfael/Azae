import { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } from 'discord.js';

/**
 * Creates a custom modal based on the specified category.
 * 
 * @param {string} category - The ticket category for which the modal is created.
 * @returns {ModalBuilder} A ModalBuilder object configured with the appropriate fields.
 */
export function createModalForCategory(category: string): ModalBuilder {
    // Create a new instance of ModalBuilder
    const modal = new ModalBuilder()
        .setCustomId(`ticket_modal_${category}`) // Set a unique identifier for the modal, including the category.
        .setTitle('Ouvrir un Ticket'); // Set the title displayed on the modal.

    // Array to store the component rows (input fields) of the modal
    const components: ActionRowBuilder<TextInputBuilder>[] = [];

    // Create the common input field: In-game username (required)
    const usernameInput = new TextInputBuilder()
        .setCustomId('Pseudo en jeu') // Unique identifier for the input field.
        .setLabel('Quel est votre pseudo en jeu?') // Label displayed above the field.
        .setStyle(TextInputStyle.Short) // Type of input field (short text).
        .setRequired(true) // Indicates that this field is required.
        .setPlaceholder("Ex: JeanMichelDu22"); // Placeholder text in the field.

    // Add the in-game username input field to a new component row
    components.push(new ActionRowBuilder<TextInputBuilder>().addComponents(usernameInput));

    // Select additional fields based on the specified category
    switch (category) {
        case 'support':
            // Field: Server/World (optional)
            const askType = new TextInputBuilder()
                .setCustomId('askType')
                .setLabel('Quel est le type de votre demande ?')
                .setStyle(TextInputStyle.Short)
                .setRequired(true)
                .setPlaceholder("Ex: Question, Aide, Bug, Demande etc.")
                .setMaxLength(15);

            // Field: Bug description (required)
            const instanceName = new TextInputBuilder()
                .setCustomId('Instance')
                .setLabel('Dans quelle instance êtes-vous ?')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true)
                .setPlaceholder("Ex: Spawn, Minage, Habitable etc.")
                .setMaxLength(800);

            // Field: How to reproduce the bug? (optional)
            const askContent = new TextInputBuilder()
                .setCustomId('Description')
                .setLabel('Description de votre demande')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true)
                .setPlaceholder("ex: Bonjour, voici ma demande..")
                .setMaxLength(800);

            // Field: Chat error (optional)
            const supportComplementInput = new TextInputBuilder()
                .setCustomId('Complément d\'informations')
                .setLabel('Complément d\'informations')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(false)
                .setPlaceholder("ex: Position F3, erreur tchat, etc.")
                .setMaxLength(200);

            // Add fields specific to the "signalement_bug" category to component rows
            components.push(
                new ActionRowBuilder<TextInputBuilder>().addComponents(askType),
                new ActionRowBuilder<TextInputBuilder>().addComponents(instanceName),
                new ActionRowBuilder<TextInputBuilder>().addComponents(askContent),
                new ActionRowBuilder<TextInputBuilder>().addComponents(supportComplementInput),
            );
            break;

        case 'moderation':
            // Create and configure fields specific to the "plainte" category

            // Field: Server/World (optional)
            const plainType = new TextInputBuilder()
                .setCustomId('Type de demande')
                .setLabel('Quel est le type de votre demande ?')
                .setStyle(TextInputStyle.Short)
                .setRequired(true)
                .setPlaceholder("Ex: Signalement, remboursement etc.")
                .setMaxLength(15);
            
            const modInstanceType = new TextInputBuilder()
                .setCustomId('Instance')
                .setLabel('Dans quelle instance êtes-vous ?')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true)
                .setPlaceholder("Ex: Spawn, Minage, Habitable etc.")
                .setMaxLength(800);

            // Field: Problem description (required)
            const modProblemDescription = new TextInputBuilder()
                .setCustomId('Description du problème')
                .setLabel('Description du problème')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true)
                .setPlaceholder("Ex: Bonjour, voici ma demande..")
                .setMaxLength(800);

            const modComplementInput = new TextInputBuilder()
                .setCustomId('Informations complémentaires')
                .setLabel('Informations complémentaires')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true)
                .setPlaceholder("Ex: Position F3, erreur tchat, etc.")
                .setMaxLength(800);

            // Add fields specific to the "plainte" category to component rows
            components.push(
                new ActionRowBuilder<TextInputBuilder>().addComponents(plainType),
                new ActionRowBuilder<TextInputBuilder>().addComponents(modInstanceType),
                new ActionRowBuilder<TextInputBuilder>().addComponents(modComplementInput),
                new ActionRowBuilder<TextInputBuilder>().addComponents(modProblemDescription),
            );
            break;

        case 'partenariats':
            // Create and configure fields specific to the "questions_aide" category

            // Field: Server/World (optional)
            const partName = new TextInputBuilder()
                .setCustomId('Nom du projet')
                .setLabel('Quel est le nom de votre projet ?')
                .setStyle(TextInputStyle.Short)
                .setRequired(true)
                .setPlaceholder("Ex: Nom artiste, projet, société etc.")
                .setMaxLength(20);

            const partCondition = new TextInputBuilder()
                .setCustomId('Type')
                .setLabel(`Type de partenariat`)
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true)
                .setPlaceholder("Ex: Échange de visibilité, graphismes, etc.")
                .setMaxLength(50);

            // Field: What do you need? (required)
            const partProposal = new TextInputBuilder()
                .setCustomId('Votre proposition')
                .setLabel('Décrivez nous votre proposition')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true)
                .setPlaceholder("ex: Bonjour, voici ma proposition..")
                .setMaxLength(800);
            
            const partContact = new TextInputBuilder()
                .setCustomId('Recontacter')
                .setLabel('Comment vous contacter ?')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true)
                .setPlaceholder("ex: Discord, mail, instagram..")
                .setMaxLength(800);

            // Add fields specific to the "questions_aide" category to component rows
            components.push(
                new ActionRowBuilder<TextInputBuilder>().addComponents(partName),
                new ActionRowBuilder<TextInputBuilder>().addComponents(partCondition),
                new ActionRowBuilder<TextInputBuilder>().addComponents(partProposal),
                new ActionRowBuilder<TextInputBuilder>().addComponents(partContact),
            );
            break;
    }

    // Add all components (input fields) to the modal
    modal.addComponents(...components);

    // Return the fully configured modal
    return modal;
}
