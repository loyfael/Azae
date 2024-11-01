// src/config/config.ts

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
export const STAFF_ROLE_ID = '1263546795137437714'; // ID du rôle du staff

/**
 * ID du salon où les transcripts (transcriptions) des tickets sont envoyés.
 * Cela permet de conserver un historique des interactions pour référence future.
 */
export const TRANSCRIPT_CHANNEL_ID = '1299661497575931914'; // ID du salon où envoyer les transcripts

// IDs des rôles autorisés pour la catégorie "bug"

/**
 * ID du premier rôle autorisé à interagir avec les tickets de type "bug".
 * Ce rôle peut appartenir à des développeurs ou des testeurs responsables de la gestion des bugs.
 */
export const BUG_ROLE_ID_1 = '1300536444133179444'; // Remplacez par l'ID du premier rôle

/**
 * ID du second rôle autorisé à interagir avec les tickets de type "bug".
 * Ce rôle peut être utilisé pour d'autres membres du staff impliqués dans la résolution des bugs.
 */
export const BUG_ROLE_ID_2 = '1263546795129311288'; // Remplacez par l'ID du second rôle

/**
 * ID de l'application Discord (Client ID).
 * Utilisé pour le déploiement des commandes.
 */
export const CLIENT_ID = '1294964348703215727'; // Remplacez par votre Client ID

/**
 * ID de la guilde (serveur Discord).
 * Utilisé pour le déploiement des commandes.
 */
export const GUILD_ID = '1263546794957078614'; // Remplacez par votre Guild ID
