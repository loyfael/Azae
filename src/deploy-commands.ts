// src/deploy-commands.ts

// Import necessary classes from discord.js
import { REST, Routes } from 'discord.js';

// Import custom command data
import { data as ticketAddCommand } from './commands/ticketAdd'; // Example of a custom command

// Import dotenv module to manage environment variables
import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file

// Import custom configuration constants
import { CLIENT_ID, GUILD_ID } from './config/config'; // Client and guild IDs

/**
 * Array containing all commands to be deployed.
 * 
 * Each command must be exported with a `data` property containing the command definition.
 * The `toJSON()` method converts the command to a format compatible with the Discord API.
 */
const commands = [
    ticketAddCommand.toJSON(),
    // Add other commands here if necessary, for example:
    // anotherCommand.toJSON(),
];

/**
 * REST instance to interact with the Discord API.
 * 
 * - `version: '10'` : Specifies the version of the Discord API to use.
 * - `.setToken(...)` : Sets the bot token to authenticate requests.
 */
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN!);

/**
 * Self-invoking function to deploy commands to a specific Discord server.
 * 
 * Uses Discord API routes to register commands at the guild level.
 * This allows for quick command refresh without propagation delay.
 */
(async () => {
    try {
        console.log('Refreshing commands...');

        /**
         * PUT request to the Discord API to update application commands in a specific guild.
         * 
         * - `Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID)` : Specifies the API URL to deploy commands at the guild level.
         * - `{ body: commands }` : Sends the array of formatted commands in the request body.
         */
        await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
            { body: commands },
        );

        console.log('Commands have been successfully refreshed.');
    } catch (error) {
        /**
         * Error handling during command deployment.
         * 
         * - Log errors for troubleshooting.
         */
        console.log('Commands could not be refreshed. Error below:');
        console.error(error);
    }
})();
