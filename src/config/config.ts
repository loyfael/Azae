/**
 * ID du salon où le menu de sélection des catégories est affiché.
 * Ce salon permet aux utilisateurs de choisir la catégorie de leur ticket.
 */
export const CHANNEL_ID = '1263546795586490419'; // ID du salon pour le menu de sélection

/**
 * ID de la catégorie contenant les salons de tickets.
 * Chaque ticket sera créé sous cette catégorie pour une organisation optimale.
 */
export const CATEGORY_ID = '1263546795586490418'; // ID de la catégorie pour les tickets

/**
 * ID du rôle du staff.
 * Ce rôle est attribué aux membres de l'équipe de support qui géreront les tickets.
 */
export const STAFF_ROLE_ID = '1302594263565205515'; // ID du rôle du staff

/**
 * ID du salon où les transcripts (transcriptions) des tickets sont envoyés.
 * Cela permet de conserver un historique des interactions pour référence future.
 */
export const TRANSCRIPT_CHANNEL_ID = '1299661497575931914'; // ID du salon où envoyer les transcripts

/**
 * ID de l'application Discord (Client ID).
 * Utilisé pour le déploiement des commandes.
 */
export const CLIENT_ID = '1304814854393303050'; // Remplacez par votre Client ID

/**
 * ID de la guilde (serveur Discord).
 * Utilisé pour le déploiement des commandes.
 */
export const GUILD_ID = '1263546794957078614'; // Remplacez par votre Guild ID

// Nouveaux rôles pour la gestion des permissions des tickets

/**
 * ID du rôle Guide.
 * Ce rôle peut voir uniquement les tickets de type "Question".
 */
export const GUIDE_ROLE_ID = '1304844249040158782'; // Remplacez par l'ID du rôle Guide

/**
 * ID du rôle Game Dev.
 * Ce rôle peut voir les tickets de type "Bug", "Question" et "Remboursement".
 */
export const GAME_DEV_ROLE_ID = '1304844271265775649'; // Remplacez par l'ID du rôle Game Dev

/**
 * ID du rôle Modo.
 * Ce rôle peut voir les tickets de type "Plainte", "Question" et "Contestation".
 */
export const MODO_ROLE_ID = '1300536444133179444'; // Remplacez par l'ID du rôle Modo

/**
 * ID du rôle SuperModo.
 * Ce rôle peut voir les tickets de type "Plainte", "Question" et "Contestation".
 */
export const SUPERMODO_ROLE_ID = '1304844213443100683'; // Remplacez par l'ID du rôle SuperModo

/**
 * IDs des rôles supérieurs.
 * Ces rôles peuvent voir tous les tickets, quelle que soit la catégorie.
 */
export const HIGHER_ROLES_IDS = ['1304844457027440771', '1263546795137437714']; // Remplacez par les IDs des rôles supérieurs
