/**
 * ID of the channel where the category selection menu is displayed.
 * This channel allows users to choose the category of their ticket.
 */
export const CHANNEL_ID = '1263546795586490419'; // ID of the channel for the selection menu

/**
 * ID of the category containing the ticket channels.
 * Each ticket will be created under this category for optimal organization.
 */
export const CATEGORY_ID = '1263546795586490418'; // ID of the category for tickets

/**
 * ID of the staff role.
 * This role is assigned to support team members who will manage the tickets.
 */
export const STAFF_ROLE_ID = '1302594263565205515'; // ID of the staff role

/**
 * ID of the channel where ticket transcripts are sent.
 * This allows keeping a history of interactions for future reference.
 */
export const TRANSCRIPT_CHANNEL_ID = '1299661497575931914'; // ID of the channel to send transcripts

/**
 * ID of the Discord application (Client ID).
 * Used for deploying commands.
 */
export const CLIENT_ID = '1304814854393303050'; // Replace with your Client ID

/**
 * ID of the guild (Discord server).
 * Used for deploying commands.
 */
export const GUILD_ID = '1263546794957078614'; // Replace with your Guild ID

// New roles for managing ticket permissions

/**
 * ID of the Guide role.
 * This role can only see "Question" type tickets.
 */
export const GUIDE_ROLE_ID = '1304844249040158782'; // Replace with the Guide role ID

/**
 * ID of the Game Dev role.
 * This role can see "Bug", "Question", and "Refund" type tickets.
 */
export const GAME_DEV_ROLE_ID = '1304844271265775649'; // Replace with the Game Dev role ID

/**
 * ID of the Modo role.
 * This role can see "Complaint", "Question", and "Contest" type tickets.
 */
export const MODO_ROLE_ID = '1300536444133179444'; // Replace with the Modo role ID

/**
 * ID of the SuperModo role.
 * This role can see "Complaint", "Question", and "Contest" type tickets.
 */
export const SUPERMODO_ROLE_ID = '1304844213443100683'; // Replace with the SuperModo role ID

/**
 * IDs of higher roles.
 * These roles can see all tickets, regardless of the category.
 */
export const HIGHER_ROLES_IDS = ['1304844457027440771', '1263546795137437714']; // Replace with the IDs of higher roles
