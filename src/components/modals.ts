import { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } from 'discord.js';

/**
 * Crée un modal (fenêtre modale) personnalisé en fonction de la catégorie spécifiée.
 * 
 * @param {string} category - La catégorie du ticket pour laquelle le modal est créé.
 * @returns {ModalBuilder} Un objet ModalBuilder configuré avec les champs appropriés.
 */
export function createModalForCategory(category: string): ModalBuilder {
    // Création d'une nouvelle instance de ModalBuilder
    const modal = new ModalBuilder()
        .setCustomId(`ticket_modal_${category}`) // Définit un identifiant unique pour le modal, incluant la catégorie.
        .setTitle('Ouvrir un Ticket'); // Définit le titre affiché sur le modal.

    // Tableau pour stocker les lignes de composants (champs de saisie) du modal
    const components: ActionRowBuilder<TextInputBuilder>[] = [];

    // Création du champ de saisie commun : Pseudo en jeu (obligatoire)
    const usernameInput = new TextInputBuilder()
        .setCustomId('Pseudo en jeu') // Identifiant unique pour le champ de saisie.
        .setLabel('Votre pseudo en jeu') // Étiquette affichée au-dessus du champ.
        .setStyle(TextInputStyle.Short) // Type de champ de saisie (court texte).
        .setRequired(true) // Indique que ce champ est obligatoire.
        .setPlaceholder("Entrez votre pseudo en jeu."); // Texte indicatif dans le champ.

    // Ajout du champ de saisie du pseudo en jeu dans une nouvelle ligne de composants
    components.push(new ActionRowBuilder<TextInputBuilder>().addComponents(usernameInput));

    // Sélection des champs supplémentaires en fonction de la catégorie spécifiée
    switch (category) {
        case 'signalement_bug':
            // Création et configuration des champs spécifiques pour la catégorie "signalement_bug"

            // Champ : Serveur/Monde (optionnel)
            const serverWorldInput_bug = new TextInputBuilder()
                .setCustomId('Serveur/Monde')
                .setLabel('Sur quel serveur/monde ?')
                .setStyle(TextInputStyle.Short)
                .setRequired(false)
                .setPlaceholder("Sur lequel de nos serveur et/ou monde ?")
                .setMaxLength(15);

            // Champ : Description du bug (obligatoire)
            const bugDescriptionInput = new TextInputBuilder()
                .setCustomId('Description du bug')
                .setLabel('Description du bug')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true)
                .setPlaceholder("Quel bug avez-vous rencontré(e) ?")
                .setMaxLength(850);

            // Champ : Comment reproduire le bug? (optionnel)
            const reproduceBugInput = new TextInputBuilder()
                .setCustomId('Comment reproduire le bug')
                .setLabel('Comment reproduire le bug ?')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(false)
                .setPlaceholder("Expliquez-nous comment reproduire ce bug.")
                .setMaxLength(850);

            // Champ : Erreur dans le tchat (optionnel)
            const chatErrorInput = new TextInputBuilder()
                .setCustomId('Erreur dans le tchat')
                .setLabel('Erreur dans le tchat')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(false)
                .setPlaceholder("Écrivez l'erreur s'il y en a une.")
                .setMaxLength(200);

            // Ajout des champs spécifiques à la catégorie "signalement_bug" dans des lignes de composants
            components.push(
                new ActionRowBuilder<TextInputBuilder>().addComponents(serverWorldInput_bug),
                new ActionRowBuilder<TextInputBuilder>().addComponents(bugDescriptionInput),
                new ActionRowBuilder<TextInputBuilder>().addComponents(reproduceBugInput),
                new ActionRowBuilder<TextInputBuilder>().addComponents(chatErrorInput),
            );
            break;

        case 'plainte':
            // Création et configuration des champs spécifiques pour la catégorie "plainte"

            // Champ : Serveur/Monde (optionnel)
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

            // Champ : Pseudo du/des fautif(s) (obligatoire)
            const offenderInput = new TextInputBuilder()
                .setCustomId('Pseudo du/des fautif(s)')
                .setLabel('Pseudo du/des fautif(s)')
                .setStyle(TextInputStyle.Short)
                .setRequired(true)
                .setPlaceholder("Entrez le(s) pseudo(s) du/des fautif(s).")
                .setMaxLength(20);

            // Champ : Description du problème (obligatoire)
            const problemDescriptionInput = new TextInputBuilder()
                .setCustomId('Description du problème')
                .setLabel('Description du problème')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true)
                .setPlaceholder("Décrivez le problème rencontré.")
                .setMaxLength(850);

            // Ajout des champs spécifiques à la catégorie "plainte" dans des lignes de composants
            components.push(
                new ActionRowBuilder<TextInputBuilder>().addComponents(serverWorldInput_plainte),
                new ActionRowBuilder<TextInputBuilder>().addComponents(plaintWorldPosInput),
                new ActionRowBuilder<TextInputBuilder>().addComponents(offenderInput),
                new ActionRowBuilder<TextInputBuilder>().addComponents(problemDescriptionInput),
            );
            break;

        case 'questions_aide':
            // Création et configuration des champs spécifiques pour la catégorie "questions_aide"

            // Champ : Serveur/Monde (optionnel)
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

            // Champ : De quoi avez-vous besoin ? (obligatoire)
            const needInput = new TextInputBuilder()
                .setCustomId('Votre demande')
                .setLabel('De quoi avez-vous besoin ?')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true)
                .setPlaceholder("Expliquez votre besoin.")
                .setMaxLength(850);

            // Ajout des champs spécifiques à la catégorie "questions_aide" dans des lignes de composants
            components.push(
                new ActionRowBuilder<TextInputBuilder>().addComponents(serverWorldInput_aide),
                new ActionRowBuilder<TextInputBuilder>().addComponents(questionWorldPosInput),
                new ActionRowBuilder<TextInputBuilder>().addComponents(needInput),
            );
            break;

        case 'remboursements':
            // Création et configuration des champs spécifiques pour la catégorie "remboursements"

            // Champ : Serveur/Monde (optionnel)
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

            // Champ : Comment avez-vous perdu vos équipements ? (obligatoire)
            const lossExplanationInput = new TextInputBuilder()
                .setCustomId('Comment avez-vous perdu vos équipements')
                .setLabel('Comment avez-vous perdu vos équipements ?')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true)
                .setPlaceholder("Expliquez les circonstances de la perte.")
                .setMaxLength(850);

            // Champ : Avez-vous vu un comportement anormal du serveur ? (optionnel)
            const serverIssueInput = new TextInputBuilder()
                .setCustomId('Comportement anormal du serveur')
                .setLabel('Comportement anormal du serveur ?')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(false)
                .setPlaceholder("Avez-vous vu un comportement anormal du serveur ?")
                .setMaxLength(500);

            // Ajout des champs spécifiques à la catégorie "remboursements" dans des lignes de composants
            components.push(
                new ActionRowBuilder<TextInputBuilder>().addComponents(serverWorldInput_remboursement),
                new ActionRowBuilder<TextInputBuilder>().addComponents(refundWorldPosInput),
                new ActionRowBuilder<TextInputBuilder>().addComponents(lossExplanationInput),
                new ActionRowBuilder<TextInputBuilder>().addComponents(serverIssueInput),
            );
            break;

        case 'contestation_sanction':
            // Création et configuration des champs spécifiques pour la catégorie "contestation_sanction"

            // Champ : Pourquoi avez-vous été sanctionné ? (obligatoire)
            const sanctionReasonInput = new TextInputBuilder()
                .setCustomId('Raison de la sanction')
                .setLabel('Pourquoi avez-vous été sanctionné ?')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true)
                .setPlaceholder("Expliquez la raison de votre sanction.")
                .setMaxLength(500);

            // Champ : Pour quelle raison devrions-nous retirer votre sanction ? (optionnel)
            const appealReasonInput = new TextInputBuilder()
                .setCustomId('Raison du retrait de la sanction')
                .setLabel('Pour quelle raison retirer votre sanction ?')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(false)
                .setPlaceholder("Pour quelle raison devrions-nous retirer votre sanction ?")
                .setMaxLength(850);

            // Ajout des champs spécifiques à la catégorie "contestation_sanction" dans des lignes de composants
            components.push(
                new ActionRowBuilder<TextInputBuilder>().addComponents(sanctionReasonInput),
                new ActionRowBuilder<TextInputBuilder>().addComponents(appealReasonInput),
            );
            break;

        case 'intervention':
            // Création et configuration des champs spécifiques pour la catégorie "intervention"

            // Champ : Serveur/Monde (optionnel)
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

            // Champ : Pourquoi avez-vous besoin d'une intervention Haut Staff ? (obligatoire)
            const interventionReasonInput = new TextInputBuilder()
                .setCustomId('Raison de l\'intervention')
                .setLabel('Pourquoi une intervention Haut Staff ?')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true)
                .setPlaceholder("Pourquoi avez-vous besoin d'une intervention Haut Staff ?")
                .setMaxLength(850);

            // Ajout des champs spécifiques à la catégorie "intervention" dans des lignes de composants
            components.push(
                new ActionRowBuilder<TextInputBuilder>().addComponents(serverWorldInput_intervention),
                new ActionRowBuilder<TextInputBuilder>().addComponents(interventionWorldPosInput),
                new ActionRowBuilder<TextInputBuilder>().addComponents(interventionReasonInput),
            );
            
            break;

        case 'partenariats':
            // Création et configuration des champs spécifiques pour la catégorie "partenariats"

            // Champ : Présentez-nous votre projet (obligatoire)
            const projectPresentationInput = new TextInputBuilder()
                .setCustomId('Présentation du projet')
                .setLabel('Présentez-nous votre projet')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true)
                .setPlaceholder("Décrivez votre projet en détail.")
                .setMaxLength(850);

            // Ajout du champ spécifique à la catégorie "partenariats" dans une ligne de composants
            components.push(
                new ActionRowBuilder<TextInputBuilder>().addComponents(projectPresentationInput),
            );
            break;

        default:
            // Catégorie inconnue, utilisation d'un formulaire par défaut

            // Champ : Raison du ticket (obligatoire)
            const defaultReasonInput = new TextInputBuilder()
                .setCustomId('Raison du ticket')
                .setLabel('Raison du ticket')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(false)
                .setPlaceholder("Entrez la raison de votre demande. N'oubliez pas la politesse !")
                .setMaxLength(850);

            // Ajout du champ par défaut dans une ligne de composants
            components.push(new ActionRowBuilder<TextInputBuilder>().addComponents(defaultReasonInput));
            break;
    }

    // Ajout de tous les composants (champs de saisie) au modal
    modal.addComponents(...components);

    // Retourne le modal entièrement configuré
    return modal;
}
