// Import the Message class from discord.js
import { Message } from 'discord.js';

/**
 * Formats a Discord message into a readable string.
 * 
 * This function is used to create transcripts of ticket channels by
 * converting Discord messages into a simple textual representation.
 * It includes the message content, embeds, and attachments.
 * 
 * @param {Message} message - The Discord message to format.
 * @returns {string} The formatted textual representation of the message.
 */
export function formatMessage(message: Message): string {
    // Retrieve the author's tag (e.g., "Username#1234")
    const author = `${message.author.tag}`;
    
    // Initialize the message content with the message text or an empty string if no content
    let content = message.content || '';

    // Check if the message contains embeds and include them in the formatted content
    if (message.embeds.length > 0) {
        content += '\n[Embed]'; // Indicates the presence of an embed

        // Iterate over each embed in the message
        message.embeds.forEach(embed => {
            // If the embed has a title, add it to the content
            if (embed.title) content += `\nTitle: ${embed.title}`;
            
            // If the embed has a description, add it to the content
            if (embed.description) content += `\nDescription: ${embed.description}`;
            
            // If the embed has fields, add them to the content
            if (embed.fields) {
                embed.fields.forEach(field => {
                    content += `\n${field.name}: ${field.value}`;
                });
            }
        });
    }

    // Check if the message contains attachments and include them in the formatted content
    if (message.attachments.size > 0) {
        content += '\n[Attachments]'; // Indicates the presence of attachments

        // Iterate over each attachment in the message
        message.attachments.forEach(attachment => {
            content += `\n${attachment.url}`; // Add the attachment URL to the content
        });
    }

    // Return the formatted string with the author and message content
    return `${author}: ${content}`;
}
