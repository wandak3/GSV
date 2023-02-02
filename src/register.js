const { REST, Routes } = require('discord.js');
const { ClientId, GuildId, Token } = require('./config/config.json');
const { readdirSync } = require('fs');

const slash = [];
const commandFolder = readdirSync('./src/commands/slash');
for (const folder of commandFolder) {
    const commandFile = readdirSync(`./src/commands/slash/${folder}`).filter(files => files.endsWith(".js"));
    for (const file of commandFile) {
        const command = require(`./commands/slash/${folder}/${file}`);
        slash.push(command.data.toJSON());
    }
}
const rest = new REST({ version: '10' }).setToken(Token);
(async () => {
	try {
		console.log(`Started refreshing ${slash.length} application (/) slash.`);
		const data = await rest.put(
			Routes.applicationGuildCommands(ClientId, GuildId),
			{ body: slash },
		);
		console.log(`Successfully reloaded ${data.length} application (/) slash.`);
	} catch (error) {
		console.error(error);
	}
})();