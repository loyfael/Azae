/**
 * Sanitize a channel name to comply with Discord's requirements.
 * 
 * This function cleans up a channel name by removing all characters that are not
 * letters (a-z, A-Z), numbers (0-9), underscores (_), or hyphens (-).
 * Additionally, it limits the length of the channel name to 100 characters, in accordance
 * with Discord's limitations.
 * 
 * @param {string} name - The original channel name to sanitize.
 * @returns {string} The sanitized channel name, ready to be used in Discord.
 */
export function sanitizeChannelName(name: string): string {
    // Replace all characters that are not letters, numbers, underscores, or hyphens with an empty string.
    const sanitized = name.replace(/[^a-zA-Z0-9_-]/g, '');

    // Truncate the channel name to a maximum of 100 characters, as Discord imposes this limit.
    const truncated = sanitized.substring(0, 100);

    return truncated;
}
