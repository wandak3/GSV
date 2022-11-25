const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { Token } = require('./config/config.json');

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
['event', 'command', 'error', 'slash'].forEach(handler => {
    require(`./handler/${handler}`)(client, Client);
});

client.login(Token);