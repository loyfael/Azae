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
        .setLabel('Votre pseudo en jeu') // Label displayed above the field.
        .setStyle(TextInputStyle.Short) // Type of input field (short text).
        .setRequired(true) // Indicates that this field is required.
        .setPlaceholder("Entrez votre pseudo en jeu."); // Placeholder text in the field.

    // Add the in-game username input field to a new component row
    components.push(new ActionRowBuilder<TextInputBuilder>().addComponents(usernameInput));

    // Select additional fields based on the specified category
    switch (category) {
        case 'signalement_bug':
            // Create and configure fields specific to the "signalement_bug" category

            // Field: Server/World (optional)
            const serverWorldInput_bug = new TextInputBuilder()
                .setCustomId('Serveur/Monde')
                .setLabel('Sur quel serveur/monde ?')
                .setStyle(TextInputStyle.Short)
                .setRequired(false)
                .setPlaceholder("Sur lequel de nos serveur et/ou monde ?")
                .setMaxLength(15);

            // Field: Bug description (required)
            const bugDescriptionInput = new TextInputBuilder()
                .setCustomId('Description du problème')
                .setLabel('Description du problème')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true)
                .setPlaceholder("Décrivez le problème. N'oubliez pas la politesse !")
                .setMaxLength(800);

            // Field: How to reproduce the bug? (optional)
            const reproduceBugInput = new TextInputBuilder()
                .setCustomId('Comment reproduire le bug')
                .setLabel('Comment reproduire le bug ?')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(false)
                .setPlaceholder("Expliquez-nous comment reproduire ce bug.")
                .setMaxLength(800);

            // Field: Chat error (optional)
            const chatErrorInput = new TextInputBuilder()
                .setCustomId('Erreur dans le tchat')
                .setLabel('Erreur dans le tchat')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(false)
                .setPlaceholder("Écrivez l'erreur s'il y en a une.")
                .setMaxLength(200);

            // Add fields specific to the "signalement_bug" category to component rows
            components.push(
                new ActionRowBuilder<TextInputBuilder>().addComponents(serverWorldInput_bug),
                new ActionRowBuilder<TextInputBuilder>().addComponents(bugDescriptionInput),
                new ActionRowBuilder<TextInputBuilder>().addComponents(reproduceBugInput),
                new ActionRowBuilder<TextInputBuilder>().addComponents(chatErrorInput),
            );
            break;

        case 'plainte':
            // Create and configure fields specific to the "plainte" category

            // Field: Server/World (optional)
            const serverWorldInput_plainte = new TextInputBuilder()
                .setCustomId('Serveur/Monde')
                .setLabel('Sur quel serveur/monde ?')
                .setStyle(TextInputStyle.Short)
                .setRequired(false)
                .setPlaceholder("Sur lequel de nos serveur et/ou monde ?")
                .setMaxLength(15);

            const plaintWorldPosInput = new TextInputBuilder()
                .setCustomId('Position')
                .setLabel(`Avez vous une position?`)
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true)
                .setPlaceholder("Indiquez la (Ctrl+F3) position X Y Z")
                .setMaxLength(50);

            // Field: Offender's username(s) (required)
            const offenderInput = new TextInputBuilder()
                .setCustomId('Pseudo du/des fautif(s)')
                .setLabel('Pseudo du/des fautif(s)')
                .setStyle(TextInputStyle.Short)
                .setRequired(true)
                .setPlaceholder("Entrez le(s) pseudo(s) du/des fautif(s).")
                .setMaxLength(20);

            // Field: Problem description (required)
            const problemDescriptionInput = new TextInputBuilder()
                .setCustomId('Description du problème')
                .setLabel('Description du problème')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true)
                .setPlaceholder("Décrivez le problème. N'oubliez pas la politesse !")
                .setMaxLength(800);

            // Add fields specific to the "plainte" category to component rows
            components.push(
                new ActionRowBuilder<TextInputBuilder>().addComponents(serverWorldInput_plainte),
                new ActionRowBuilder<TextInputBuilder>().addComponents(plaintWorldPosInput),
                new ActionRowBuilder<TextInputBuilder>().addComponents(offenderInput),
                new ActionRowBuilder<TextInputBuilder>().addComponents(problemDescriptionInput),
            );
            break;

        case 'questions_aide':
            // Create and configure fields specific to the "questions_aide" category

            // Field: Server/World (optional)
            const serverWorldInput_aide = new TextInputBuilder()
                .setCustomId('Serveur/Monde')
                .setLabel('Sur quel serveur/monde ?')
                .setStyle(TextInputStyle.Short)
                .setRequired(false)
                .setPlaceholder("Sur lequel de nos serveur et/ou monde ?")
                .setMaxLength(20);

            const questionWorldPosInput = new TextInputBuilder()
                .setCustomId('Position')
                .setLabel(`Avez vous une position?`)
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true)
                .setPlaceholder("Indiquez la (Ctrl+F3) position X Y Z")
                .setMaxLength(50);

            // Field: What do you need? (required)
            const needInput = new TextInputBuilder()
                .setCustomId('Votre demande')
                .setLabel('De quoi avez-vous besoin ?')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true)
                .setPlaceholder("Posez votre question. N'oubliez pas la politesse !")
                .setMaxLength(800);

            // Add fields specific to the "questions_aide" category to component rows
            components.push(
                new ActionRowBuilder<TextInputBuilder>().addComponents(serverWorldInput_aide),
                new ActionRowBuilder<TextInputBuilder>().addComponents(questionWorldPosInput),
                new ActionRowBuilder<TextInputBuilder>().addComponents(needInput),
            );
            break;

        case 'remboursements':
            // Create and configure fields specific to the "remboursements" category

            // Field: Server/World (optional)
            const serverWorldInput_remboursement = new TextInputBuilder()
                .setCustomId('Serveur/Monde')
                .setLabel('Sur quel serveur/monde ?')
                .setStyle(TextInputStyle.Short)
                .setRequired(false)
                .setPlaceholder("Sur lequel de nos serveur et/ou monde ?")
                .setMaxLength(20);

            const refundWorldPosInput = new TextInputBuilder()
                .setCustomId('Position')
                .setLabel(`Avez vous une position?`)
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true)
                .setPlaceholder("Indiquez la (Ctrl+F3) position X Y Z")
                .setMaxLength(50);

            // Field: How did you lose your equipment? (required)
            const lossExplanationInput = new TextInputBuilder()
                .setCustomId('Description du problème')
                .setLabel('Description du problème')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true)
                .setPlaceholder("Décrivez le problème. N'oubliez pas la politesse !")
                .setMaxLength(800);

            // Field: Did you notice any abnormal server behavior? (optional)
            const serverIssueInput = new TextInputBuilder()
                .setCustomId('Comportement anormal du serveur')
                .setLabel('Comportement anormal du serveur ?')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(false)
                .setPlaceholder("Avez-vous vu un comportement anormal du serveur ?")
                .setMaxLength(800);

            // Add fields specific to the "remboursements" category to component rows
            components.push(
                new ActionRowBuilder<TextInputBuilder>().addComponents(serverWorldInput_remboursement),
                new ActionRowBuilder<TextInputBuilder>().addComponents(refundWorldPosInput),
                new ActionRowBuilder<TextInputBuilder>().addComponents(lossExplanationInput),
                new ActionRowBuilder<TextInputBuilder>().addComponents(serverIssueInput),
            );
            break;

        case 'contestation_sanction':
            // Create and configure fields specific to the "contestation_sanction" category

            // Field: Why were you sanctioned? (required)
            const sanctionReasonInput = new TextInputBuilder()
                .setCustomId('Raison de la sanction')
                .setLabel('Pourquoi avez-vous été sanctionné ?')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true)
                .setPlaceholder("Expliquez la raison de votre sanction.")
                .setMaxLength(800);

            // Field: Why should we remove your sanction? (optional)
            const appealReasonInput = new TextInputBuilder()
                .setCustomId('Raison du retrait de la sanction')
                .setLabel('Pour quelle raison retirer votre sanction ?')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(false)
                .setPlaceholder("Pour quelle raison devrions-nous retirer votre sanction ?")
                .setMaxLength(800);

            // Add fields specific to the "contestation_sanction" category to component rows
            components.push(
                new ActionRowBuilder<TextInputBuilder>().addComponents(sanctionReasonInput),
                new ActionRowBuilder<TextInputBuilder>().addComponents(appealReasonInput),
            );
            break;

        case 'intervention':
            // Create and configure fields specific to the "intervention" category

            // Field: Server/World (optional)
            const serverWorldInput_intervention = new TextInputBuilder()
                .setCustomId('Serveur/Monde')
                .setLabel('Sur quel serveur/monde ?')
                .setStyle(TextInputStyle.Short)
                .setRequired(false)
                .setPlaceholder("Sur lequel de nos serveur et/ou monde ?")
                .setMaxLength(15);

            const interventionWorldPosInput = new TextInputBuilder()
                .setCustomId('Position')
                .setLabel(`Avez vous une position?`)
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true)
                .setPlaceholder("Indiquez la (Ctrl+F3) position X Y Z")
                .setMaxLength(50);

            // Field: Why do you need a High Staff intervention? (required)
            const interventionReasonInput = new TextInputBuilder()
                .setCustomId('Description du problème')
                .setLabel('Description du problème')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true)
                .setPlaceholder("Décrivez le problème. N'oubliez pas la politesse !")
                .setMaxLength(800);

            // Add fields specific to the "intervention" category to component rows
            components.push(
                new ActionRowBuilder<TextInputBuilder>().addComponents(serverWorldInput_intervention),
                new ActionRowBuilder<TextInputBuilder>().addComponents(interventionWorldPosInput),
                new ActionRowBuilder<TextInputBuilder>().addComponents(interventionReasonInput),
            );
            
            break;

        case 'partenariats':
            // Create and configure fields specific to the "partenariats" category

            // Field: Present your project (required)
            const projectPresentationInput = new TextInputBuilder()
                .setCustomId('Présentation du projet')
                .setLabel('Présentez-nous votre projet')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true)
                .setPlaceholder("Décrivez votre projet en détail.")
                .setMaxLength(800);

            // Add the field specific to the "partenariats" category to a component row
            components.push(
                new ActionRowBuilder<TextInputBuilder>().addComponents(projectPresentationInput),
            );
            break;

        default:
            // Unknown category, use a default form

            // Field: Ticket reason (required)
            const defaultReasonInput = new TextInputBuilder()
                .setCustomId('Raison du ticket')
                .setLabel('Raison du ticket')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(false)
                .setPlaceholder("Entrez la raison de votre demande. N'oubliez pas la politesse !")
                .setMaxLength(800);

            // Add the default field to a component row
            components.push(new ActionRowBuilder<TextInputBuilder>().addComponents(defaultReasonInput));
            break;
    }

    // Add all components (input fields) to the modal
    modal.addComponents(...components);

    // Return the fully configured modal
    return modal;
}
