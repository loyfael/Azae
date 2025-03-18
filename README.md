# Azae, ticket discord bot evolved
A robust Discord bot built with discord.js and TypeScript, designed to manage support tickets efficiently within your Discord server. This bot allows users to create, manage, and close tickets with ease, ensuring organized and streamlined support interactions.

## License
> [!WARNING]  
> This project is licensed under the GNU General Public License v3.0 (GPLv3) with a Non-Commercial Clause.
>
> - You are not allowed to sell my code.
> - In general, you may not use my code in any commercial activity.
> - You must mention that I wrote the code in any redistribution.
> - You may not say that you are the author of my code.

My code can be used and forked by anyone, but please respect my creation.
[**FULL LICENSE HERE**](https://github.com/loyfael/Azae/blob/main/LICENSE)

## Contribute
You can open an issue or a pull request if you wish. I welcome any constructive suggestions regarding my code.

## Features
**Ticket Creation:** Users can create support tickets by selecting a category from a dropdown menu.<br>
**Category-Specific Modals:** Customized input forms based on the selected ticket category.<br>
**Role-Based Permissions:** Ensures that only authorized staff and relevant roles can access and manage tickets.<br>
**Ticket Management:** Staff can add users to tickets, claim tickets, and close them with reasons.<br>
**Transcript Generation:** Automatically generates transcripts of ticket conversations for record-keeping.<br>
**Command Deployment:** Easy deployment and management of slash commands.<br>
**Sanitized Channel Names:** Ensures channel names comply with Discord's naming conventions.<br>
**Minecraft server player number:** Display player numbers on bot status<br>
<br>
## Prerequisites
Before you begin, ensure you have met the following requirements:<br>
**Node.js:** Version 20.10 or higher is required. [You can download it here.](https://nodejs.org/fr/download)<br>
**Discord Account:** You need a Discord account to create a bot and add it to your server.<br>
**Discord Server:** Access to a Discord server where you have permissions to add bots and manage roles.<br>

## Installation
### Clone the Repository:
```
git clone https://github.com/yourusername/discord-ticket-bot.git
cd <your-directory>
```
### Install Dependencies:
```
npm install
```
### Run the project:
```
npm start
```
## Configuration
### Create a Discord Bot:

1. Create your discord bot:
- Go to the [Discord Developer Portal](https://discord.com/developers/applications).
- Click on "New Application" and give it a name.
- Navigate to the "Bot" section and click "Add Bot".
- Copy the Bot Token; you'll need it for the configuration.
2. Set up Environment variables
Create a .env file in root directory:
```
DISCORD_BOT_TOKEN=your-bot-token-here
```
3. Fill src/config/config.ts with your own data

## Managing Tickets
- Adding Users to a Ticket:

### Staff members can use the /ticket add command to add additional users to an existing ticket.
```
/ticket add utilisateur:@username
```

### Claiming a Ticket:
Staff can claim a ticket by clicking the "Claim" button in the ticket channel. This action grants them permissions to manage the ticket.

### Closing a Ticket:
To close a ticket, click the "Close" button and provide a reason for closure. The transcript of the ticket will be saved in the designated transcript channel before the ticket channel is deleted.

## Folder structure
```
rootdirectory/
├── src/
│   ├── commands/
│   │   ├── ticketAdd.ts
│   │   └── ... (other command files)
│   ├── components/
│   │   ├── buttons.ts
│   │   ├── modals.ts
│   │   └── ... (other component files)
│   ├── config/
│   │   └── config.ts
│   ├── constants/
│   │   └── categoryPrefixes.ts
│   ├── events/
│   │   ├── interactionCreate.ts
│   │   ├── ready.ts
│   │   └── ... (other event handlers)
│   ├── utils/
│   │   ├── fetchChannelMessages.ts
│   │   ├── format.ts
│   │   ├── getModalFieldsForCategory.ts
│   │   └── sanitize.ts
│   ├── deploy-commands.ts
│   └── index.ts
├── .env
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```
## Bug reported
- Sometimes the number of players on the minecraft server doesn't work properly. I'll do a fix of this problem when I have time.

## FAQ
- Why doesn't the project have a configuration system?
*I don't plan to add a configuration system more advanced than the current one, because in fact I created this bot just for me, and I'm too lazy to create a configuration more advanced than config.ts and .env. This project is reserved for people who know how to tinker with code, it's not for people who have no computer knowledge. Don't modify my code unless you know exactly what you're doing.*

## Contact
For any questions or support, feel free to reach out:
- Email: aelphil@proton.me
- Discord: loyfael
