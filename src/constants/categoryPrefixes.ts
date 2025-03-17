/**
 * Mapping object of prefixes associated with each ticket category.
 * 
 * This mapping is used to generate channel names or to organize
 * tickets based on their specific category. Each key represents
 * a ticket category, and its value corresponds to the prefix used to
 * identify or name the associated channels.
 */
export const categoryPrefixes: { [key: string]: string } = {
    /**
     * Category: Bug report
     * Associated prefix: 'bug'
     * 
     * Used to identify tickets related to bugs reported by users.
     */
    'signalement_bug': 'bug',

    /**
     * Category: Complaint
     * Associated prefix: 'plainte'
     * 
     * Used for tickets where a user wants to file a complaint against another player.
     */
    'plainte': 'plainte',

    /**
     * Category: Refunds
     * Associated prefix: 'refund'
     * 
     * Used for tickets concerning refund requests, such as loss of items due to a bug.
     */
    'remboursements': 'refund',

    /**
     * Category: Contest sanction
     * Associated prefix: 'protest'
     * 
     * Used for tickets where a user wants to contest a received sanction.
     */
    'contestation_sanction': 'protest',

    /**
     * Category: Questions & Help
     * Associated prefix: 'question'
     * 
     * Used for tickets where a user has questions or needs assistance.
     */
    'questions_aide': 'question',

    /**
     * Category: Intervention
     * Associated prefix: 'inter'
     * 
     * Used for tickets requiring specific staff intervention, such as an unclaim or spawn appearance.
     */
    'intervention': 'inter',

    /**
     * Category: Partnerships
     * Associated prefix: 'partena'
     * 
     * Used for tickets related to partnership requests with the server.
     */
    'partenariats': 'partena'
};
