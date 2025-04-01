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
        case 'support':
            // Category: Bug report

            // Retrieve the value of the "Serveur/Monde" field or set a default value
            fields['askType'] = interaction.fields.getTextInputValue('askType') || 'Non spécifié';

            // Retrieve the value of the "Description du bug" field
            fields['Instance'] = interaction.fields.getTextInputValue('Instance');

            // Retrieve the value of the "Comment reproduire le bug" field or set a default value
            fields['Description'] = interaction.fields.getTextInputValue('Description') || 'Non spécifié';

            // Retrieve the value of the "Erreur dans le tchat" field or set a default value
            fields['Complément d\'informations'] = interaction.fields.getTextInputValue('Complément d\'informations') || 'Non spécifié';
            break;

        case 'moderation':
            // Category: Complaint

            // Retrieve the value of the "Serveur/Monde" field or set a default value
            fields['Type de demande'] = interaction.fields.getTextInputValue('Type de demande') || 'Non spécifié';

            // Retrieve the value of the "Position" field or set a default value
            fields['Instance'] = interaction.fields.getTextInputValue('Instance') || 'Non spécifié';

            // Retrieve the value of the "Pseudo du/des fautif(s)" field
            fields['Description du problème'] = interaction.fields.getTextInputValue('Description du problème');

            // Retrieve the value of the "Description du problème" field
            fields['Informations complémentaires'] = interaction.fields.getTextInputValue('Informations complémentaires') || 'Non spécifié';
            break;

        case 'partenariats':
            // Category: Questions & Help

            // Retrieve the value of the "Serveur/Monde" field or set a default value
            fields['Nom du projet'] = interaction.fields.getTextInputValue('Nom du projet') || 'Non spécifié';

            // Retrieve the value of the "Position" field or set a default value
            fields['Type'] = interaction.fields.getTextInputValue('Type') || 'Non spécifié';

            // Retrieve the value of the "Position" field or set a default value
            fields['Votre proposition'] = interaction.fields.getTextInputValue('Votre proposition') || 'Non spécifié';

            // Retrieve the value of the "Votre demande" field
            fields['Recontacter'] = interaction.fields.getTextInputValue('Recontacter');
            break;
    }

    // Return the object containing the fields and their values
    return fields;
}
