import { ModalSubmitInteraction } from 'discord.js';

/**
 * Retrieves the values of the modal fields based on the selected category.
 * 
 * This function is used when a modal is submitted to extract the specific data
 * provided by the user. Each ticket category has distinct fields, and this function
 * ensures that only relevant information is collected.
 * 
 * @param {string} category - The ticket category for which the fields should be retrieved.
 * @param {ModalSubmitInteraction} interaction - The modal submit interaction containing the user-entered data.
 * @returns {{ [key: string]: string }} An object containing the field names and their corresponding values.
 */
export function getModalFieldsForCategory(category: string, interaction: ModalSubmitInteraction): { [key: string]: string } {
    // Initialize an object to store the fields and their values
    const fields: { [key: string]: string } = {};

    // Retrieve the value of the common field "Pseudo en jeu" and add it to the fields object
    fields['Pseudo en jeu'] = interaction.fields.getTextInputValue('Pseudo en jeu');

    // Use a switch structure to handle the fields specific to each category
    switch (category) {
        case 'signalement_bug':
            // Category: Bug report

            // Retrieve the value of the "Serveur/Monde" field or set a default value
            fields['Serveur/Monde'] = interaction.fields.getTextInputValue('Serveur/Monde') || 'Non spécifié';

            // Retrieve the value of the "Description du bug" field
            fields['Description du bug'] = interaction.fields.getTextInputValue('Description du bug');

            // Retrieve the value of the "Comment reproduire le bug" field or set a default value
            fields['Comment reproduire le bug'] = interaction.fields.getTextInputValue('Comment reproduire le bug') || 'Non spécifié';

            // Retrieve the value of the "Erreur dans le tchat" field or set a default value
            fields['Erreur dans le tchat'] = interaction.fields.getTextInputValue('Erreur dans le tchat') || 'Non spécifié';
            break;

        case 'plainte':
            // Category: Complaint

            // Retrieve the value of the "Serveur/Monde" field or set a default value
            fields['Serveur/Monde'] = interaction.fields.getTextInputValue('Serveur/Monde') || 'Non spécifié';

            // Retrieve the value of the "Position" field or set a default value
            fields['Position'] = interaction.fields.getTextInputValue('Position') || 'Non spécifié';

            // Retrieve the value of the "Pseudo du/des fautif(s)" field
            fields['Pseudo du/des fautif(s)'] = interaction.fields.getTextInputValue('Pseudo du/des fautif(s)');

            // Retrieve the value of the "Description du problème" field
            fields['Description du problème'] = interaction.fields.getTextInputValue('Description du problème');
            break;

        case 'questions_aide':
            // Category: Questions & Help

            // Retrieve the value of the "Serveur/Monde" field or set a default value
            fields['Serveur/Monde'] = interaction.fields.getTextInputValue('Serveur/Monde') || 'Non spécifié';

            // Retrieve the value of the "Position" field or set a default value
            fields['Position'] = interaction.fields.getTextInputValue('Position') || 'Non spécifié';

            // Retrieve the value of the "Votre demande" field
            fields['Votre demande'] = interaction.fields.getTextInputValue('Votre demande');
            break;

        case 'remboursements':
            // Category: Refunds

            // Retrieve the value of the "Serveur/Monde" field or set a default value
            fields['Serveur/Monde'] = interaction.fields.getTextInputValue('Serveur/Monde') || 'Non spécifié';
            
            // Retrieve the value of the "Position" field or set a default value
            fields['Position'] = interaction.fields.getTextInputValue('Position') || 'Non spécifié';

            // Retrieve the value of the "Comment avez-vous perdu vos équipements ?" field
            fields['Comment avez-vous perdu vos équipements ?'] = interaction.fields.getTextInputValue('Comment avez-vous perdu vos équipements');

            // Retrieve the value of the "Comportement anormal du serveur ?" field or set a default value
            fields['Comportement anormal du serveur ?'] = interaction.fields.getTextInputValue('Comportement anormal du serveur') || 'Non spécifié';
            break;

        case 'contestation_sanction':
            // Category: Contest sanction

            // Retrieve the value of the "Pourquoi avez-vous été sanctionné ?" field
            fields['Pourquoi avez-vous été sanctionné ?'] = interaction.fields.getTextInputValue('Raison de la sanction');

            // Retrieve the value of the "Pourquoi retirer votre sanction ?" field or set a default value
            fields['Pourquoi retirer votre sanction ?'] = interaction.fields.getTextInputValue('Raison du retrait de la sanction') || 'Non spécifié';
            break;

        case 'intervention':
            // Category: Intervention

            // Retrieve the value of the "Serveur/Monde" field or set a default value
            fields['Serveur/Monde'] = interaction.fields.getTextInputValue('Serveur/Monde') || 'Non spécifié';

            // Retrieve the value of the "Position" field or set a default value
            fields['Position'] = interaction.fields.getTextInputValue('Position') || 'Non spécifié';

            // Retrieve the value of the "Pourquoi une intervention Haut Staff ?" field
            fields['Pourquoi une intervention Haut Staff ?'] = interaction.fields.getTextInputValue('Raison de l\'intervention');
            break;

        case 'partenariats':
            // Category: Partnerships

            // Retrieve the value of the "Présentation du projet" field
            fields['Présentation du projet'] = interaction.fields.getTextInputValue('Présentation du projet');
            break;

        default:
            // Default category if no match is found

            // Retrieve the value of the "Raison du ticket" field
            fields['Raison du ticket'] = interaction.fields.getTextInputValue('Raison du ticket');
            break;
    }

    // Return the object containing the fields and their values
    return fields;
}
