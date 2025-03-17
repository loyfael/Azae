import { TextChannel, Message } from 'discord.js';

/**
 * Fetches all messages from a Discord text channel.
 * 
 * This function iterates through a text channel and retrieves all messages by paginating
 * the message requests in batches of 100 until there are no more messages to fetch.
 * 
 * @param {TextChannel} channel - The Discord text channel from which messages need to be fetched.
 * @returns {Promise<Message[]>} A promise resolving to an array containing all messages from the channel.
 * 
 * @throws {Error} Throws an error if message retrieval fails.
 */
export async function fetchChannelMessages(channel: TextChannel): Promise<Message[]> {
    // Array to store all fetched messages
    let messages: Message[] = [];
    
    // ID of the last message fetched in the previous loop
    let lastId: string | undefined;

    // Infinite loop to fetch messages by paginating until there are no more messages
    while (true) {
        try {
            // Fetch a batch of 100 messages before the message with ID `lastId`
            const fetchedMessages = await channel.messages.fetch({ limit: 100, before: lastId });

            // If no messages are fetched, exit the loop
            if (fetchedMessages.size === 0) {
                break;
            }

            // Add the fetched messages to the `messages` array
            messages = messages.concat(Array.from(fetchedMessages.values()));

            // Update `lastId` with the ID of the last message in the current batch for the next iteration
            lastId = fetchedMessages.last()?.id;
        } catch (error) {
            // Log the error and stop the loop if an error occurs during message retrieval
            console.error('Error fetching messages:', error);
            break;
        }
    }

    // Return all fetched messages
    return messages;
}
