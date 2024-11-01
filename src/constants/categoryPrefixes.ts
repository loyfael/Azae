/**
 * Objet de mappage des préfixes associés à chaque catégorie de ticket.
 * 
 * Ce mappage est utilisé pour générer des noms de salons ou pour organiser
 * les tickets en fonction de leur catégorie spécifique. Chaque clé représente
 * une catégorie de ticket, et sa valeur correspond au préfixe utilisé pour
 * identifier ou nommer les salons associés.
 */
export const categoryPrefixes: { [key: string]: string } = {
    /**
     * Catégorie : Signalement de bug
     * Préfixe associé : 'bug'
     * 
     * Utilisé pour identifier les tickets relatifs aux bugs signalés par les utilisateurs.
     */
    'signalement_bug': 'bug',

    /**
     * Catégorie : Plainte
     * Préfixe associé : 'plainte'
     * 
     * Utilisé pour les tickets où un utilisateur souhaite déposer une plainte contre un autre joueur.
     */
    'plainte': 'plainte',

    /**
     * Catégorie : Remboursements
     * Préfixe associé : 'refund'
     * 
     * Utilisé pour les tickets concernant les demandes de remboursement, par exemple, perte d'objets due à un bug.
     */
    'remboursements': 'refund',

    /**
     * Catégorie : Contestation de sanction
     * Préfixe associé : 'protest'
     * 
     * Utilisé pour les tickets où un utilisateur souhaite contester une sanction reçue.
     */
    'contestation_sanction': 'protest',

    /**
     * Catégorie : Questions & Aide
     * Préfixe associé : 'question'
     * 
     * Utilisé pour les tickets où un utilisateur a des questions ou a besoin d'assistance.
     */
    'questions_aide': 'question',

    /**
     * Catégorie : Intervention
     * Préfixe associé : 'inter'
     * 
     * Utilisé pour les tickets nécessitant une intervention spécifique du staff, comme un unclaim ou une apparition au spawn.
     */
    'intervention': 'inter',

    /**
     * Catégorie : Partenariats
     * Préfixe associé : 'partena'
     * 
     * Utilisé pour les tickets liés aux demandes de partenariat avec le serveur.
     */
    'partenariats': 'partena'
};
