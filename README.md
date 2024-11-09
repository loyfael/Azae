# Azae, ticket discord bot evolved
A robust Discord bot built with discord.js and TypeScript, designed to manage support tickets efficiently within your Discord server. This bot allows users to create, manage, and close tickets with ease, ensuring organized and streamlined support interactions.

## Features
**Ticket Creation:** Users can create support tickets by selecting a category from a dropdown menu.<br>
**Category-Specific Modals:** Customized input forms based on the selected ticket category.<br>
**Role-Based Permissions:** Ensures that only authorized staff and relevant roles can access and manage tickets.<br>
**Ticket Management:** Staff can add users to tickets, claim tickets, and close them with reasons.<br>
**Transcript Generation:** Automatically generates transcripts of ticket conversations for record-keeping.<br>
**Command Deployment:** Easy deployment and management of slash commands.<br>
**Sanitized Channel Names:** Ensures channel names comply with Discord's naming conventions.<br>
<br>
## Prerequisites
Before you begin, ensure you have met the following requirements:
**Node.js:** Version 20.10 or higher is required. You can download it here.
**Discord Account:** You need a Discord account to create a bot and add it to your server.
**Discord Server:** Access to a Discord server where you have permissions to add bots and manage roles.

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
3. Change src/config/config.ts with your own data

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

## License
This project is licensed under the MIT License.
```
MIT License

Copyright (c) 2024-2025 Badlands Society

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Contact
For any questions or support, feel free to reach out:
- Email: aelphil@proton.me
- Discord: weirdcrow_
