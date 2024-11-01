/**
 * Sanitize un nom de canal pour qu'il soit conforme aux exigences de Discord.
 * 
 * Cette fonction nettoie le nom d'un canal en supprimant tous les caractères qui ne sont pas
 * des lettres (a-z, A-Z), des chiffres (0-9), des tirets bas (_) ou des tirets (-).
 * De plus, elle limite la longueur du nom du canal à 100 caractères, conformément aux
 * limitations imposées par Discord.
 * 
 * @param {string} name - Le nom original du canal à sanitiser.
 * @returns {string} Le nom du canal sanitisé, prêt à être utilisé dans Discord.
 */
export function sanitizeChannelName(name: string): string {
    // Remplace tous les caractères qui ne sont pas des lettres, chiffres, tirets bas ou tirets par une chaîne vide.
    const sanitized = name.replace(/[^a-zA-Z0-9_-]/g, '');

    // Tronque le nom du canal à 100 caractères maximum, car Discord impose cette limite.
    const truncated = sanitized.substring(0, 100);

    return truncated;
}
