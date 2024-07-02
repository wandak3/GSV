# GIO Control Discord Bot.
This work is still under update continously by myself. I am not a professional developer and only work on this project as a study oppurtunity so the code would still be a mess. Please pardon me and ask me any questions if you have.

The bot is designed to send GM command such as: giving item, sending mails to players, monitor the simple status of the server...

## Prerequisites

Before you begin, ensure you have met the following requirements:
- Node.js installed on your local machine. Download: https://nodejs.org/en/download/package-manager
- Discord Developer Portal account for bot token creation.

## Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/wandak3/GSV.git
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Configure your Discord bot:**
   - Go to the [Discord Developer Portal](https://discord.com/developers/applications).
   - Create a new application.
   - Navigate to the "Bot" section and add a bot.
   - Copy the bot token.

5. **Configure environment variables:**
   - Change file `env.template` to `.env` in the root directory.
   - Add your bot token, bot id and default server id to the `.env` file:
     ```
     TOKEN=your-bot-token-here
     CLIENT=your-bot-id-here
     GUILD=your-default-server-id-here
     ```
   - Add your GIO server IP address, Database URL to the `.env` file:
     ```
     IP=your-bot-token-here
     DATABASE_URL=your-database-url-here
     ```
   - Add your GIO server IP address, Database URL to the `.env` file:
     ```
     IP=your-bot-token-here
     DATABASE_URL=your-database-url-here
     ```

## Usage

To run the bot locally, use the following command:

```bash
npm run dev
```

The bot should now be online on your Discord server.

## Commands

- **Command 1**: Description of what this command does.
  ```
  !command1 [arguments] - Usage example
  ```

- **Command 2**: Description of what this command does.
  ```
  !command2 [arguments] - Usage example
  ```

Add more commands and descriptions as needed.
