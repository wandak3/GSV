import {Client, Collection, GatewayIntentBits} from 'discord.js';
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
});
import {Command, SlashCommand} from './types';
import {readdirSync} from 'fs';
import {join} from 'path';
import {config} from 'dotenv';

config();

client.slashCommands = new Collection<string, SlashCommand>();
client.commands = new Collection<string, Command>();
client.cooldowns = new Collection<string, number>();
client.address = '35.215.183.254:3306';
client.database = 'mysql://root:Wumpus@2023@35.215.183.254:3306/db_hk4e_config';

const handlersDir = join(__dirname, './handlers');
readdirSync(handlersDir).forEach((handler) => {
	require(`${handlersDir}/${handler}`)(client);
});
export default client;
client.login(process.env.TOKEN);
