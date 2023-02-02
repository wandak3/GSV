const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { Token } = require('./src/config/config.json');

const client = new Client({
    checkUpdate: false,
    intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
});

client.commands = new Collection();
client.slash = new Collection();
['event', 'command', 'error', 'slash'].forEach(handler => {
    require(`./src/handler/${handler}`)(client, Client);
});

client.login(Token);