import { ModalSubmitInteraction } from 'discord.js';

/**
 * Récupère les valeurs des champs de la modale en fonction de la catégorie sélectionnée.
 * 
 * Cette fonction est utilisée lors de la soumission d'une modale pour extraire les données
 * spécifiques fournies par l'utilisateur. Chaque catégorie de ticket a des champs distincts,
 * et cette fonction s'assure que seules les informations pertinentes sont collectées.
 * 
 * @param {string} category - La catégorie du ticket pour laquelle les champs doivent être récupérés.
 * @param {ModalSubmitInteraction} interaction - L'interaction de soumission de la modale contenant les données saisies par l'utilisateur.
 * @returns {{ [key: string]: string }} Un objet contenant les noms des champs et leurs valeurs correspondantes.
 */
export function getModalFieldsForCategory(category: string, interaction: ModalSubmitInteraction): { [key: string]: string } {
    // Initialisation d'un objet pour stocker les champs et leurs valeurs
    const fields: { [key: string]: string } = {};

    // Récupère la valeur du champ commun "Pseudo en jeu" et l'ajoute à l'objet fields
    fields['Pseudo en jeu'] = interaction.fields.getTextInputValue('Pseudo en jeu');

    // Utilisation d'une structure switch pour gérer les champs spécifiques à chaque catégorie
    switch (category) {
        case 'signalement_bug':
            // Catégorie : Signalement de bug

            // Récupère la valeur du champ "Serveur/Monde" ou définit par défaut
            fields['Serveur/Monde'] = interaction.fields.getTextInputValue('Serveur/Monde') || 'Non spécifié';

            // Récupère la valeur du champ "Description du bug"
            fields['Description du bug'] = interaction.fields.getTextInputValue('Description du bug');

            // Récupère la valeur du champ "Comment reproduire le bug" ou définit par défaut
            fields['Comment reproduire le bug'] = interaction.fields.getTextInputValue('Comment reproduire le bug') || 'Non spécifié';

            // Récupère la valeur du champ "Erreur dans le tchat" ou définit par défaut
            fields['Erreur dans le tchat'] = interaction.fields.getTextInputValue('Erreur dans le tchat') || 'Non spécifié';
            break;

        case 'plainte':
            // Catégorie : Plainte

            // Récupère la valeur du champ "Serveur/Monde" ou définit par défaut
            fields['Serveur/Monde'] = interaction.fields.getTextInputValue('Serveur/Monde') || 'Non spécifié';

            // Récupère la valeur du champ "Position" ou définit par défaut
            fields['Position'] = interaction.fields.getTextInputValue('Position') || 'Non spécifié';

            // Récupère la valeur du champ "Pseudo du/des fautif(s)"
            fields['Pseudo du/des fautif(s)'] = interaction.fields.getTextInputValue('Pseudo du/des fautif(s)');

            // Récupère la valeur du champ "Description du problème"
            fields['Description du problème'] = interaction.fields.getTextInputValue('Description du problème');
            break;

        case 'questions_aide':
            // Catégorie : Questions & Aide

            // Récupère la valeur du champ "Serveur/Monde" ou définit par défaut
            fields['Serveur/Monde'] = interaction.fields.getTextInputValue('Serveur/Monde') || 'Non spécifié';

            // Récupère la valeur du champ "Position" ou définit par défaut
            fields['Position'] = interaction.fields.getTextInputValue('Position') || 'Non spécifié';

            // Récupère la valeur du champ "Votre demande"
            fields['Votre demande'] = interaction.fields.getTextInputValue('Votre demande');
            break;

        case 'remboursements':
            // Catégorie : Remboursements

            // Récupère la valeur du champ "Serveur/Monde" ou définit par défaut
            fields['Serveur/Monde'] = interaction.fields.getTextInputValue('Serveur/Monde') || 'Non spécifié';
            
            // Récupère la valeur du champ "Position" ou définit par défaut
            fields['Position'] = interaction.fields.getTextInputValue('Position') || 'Non spécifié';

            // Récupère la valeur du champ "Comment avez-vous perdu vos équipements ?"
            fields['Comment avez-vous perdu vos équipements ?'] = interaction.fields.getTextInputValue('Comment avez-vous perdu vos équipements');

            // Récupère la valeur du champ "Comportement anormal du serveur ?" ou définit par défaut
            fields['Comportement anormal du serveur ?'] = interaction.fields.getTextInputValue('Comportement anormal du serveur') || 'Non spécifié';
            break;

        case 'contestation_sanction':
            // Catégorie : Contestation de sanction

            // Récupère la valeur du champ "Pourquoi avez-vous été sanctionné ?"
            fields['Pourquoi avez-vous été sanctionné ?'] = interaction.fields.getTextInputValue('Raison de la sanction');

            // Récupère la valeur du champ "Pourquoi retirer votre sanction ?" ou définit par défaut
            fields['Pourquoi retirer votre sanction ?'] = interaction.fields.getTextInputValue('Raison du retrait de la sanction') || 'Non spécifié';
            break;

        case 'intervention':
            // Catégorie : Intervention

            // Récupère la valeur du champ "Serveur/Monde" ou définit par défaut
            fields['Serveur/Monde'] = interaction.fields.getTextInputValue('Serveur/Monde') || 'Non spécifié';

            // Récupère la valeur du champ "Position" ou définit par défaut
            fields['Position'] = interaction.fields.getTextInputValue('Position') || 'Non spécifié';

            // Récupère la valeur du champ "Pourquoi une intervention Haut Staff ?"
            fields['Pourquoi une intervention Haut Staff ?'] = interaction.fields.getTextInputValue('Raison de l\'intervention');
            break;

        case 'partenariats':
            // Catégorie : Partenariats

            // Récupère la valeur du champ "Présentation du projet"
            fields['Présentation du projet'] = interaction.fields.getTextInputValue('Présentation du projet');
            break;

        default:
            // Catégorie par défaut si aucune correspondance n'est trouvée

            // Récupère la valeur du champ "Raison du ticket"
            fields['Raison du ticket'] = interaction.fields.getTextInputValue('Raison du ticket');
            break;
    }

    // Retourne l'objet contenant les champs et leurs valeurs
    return fields;
}
