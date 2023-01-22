const { REST, Routes } = require('discord.js');
const { ClientId, GuildId, Token } = require('../config/config.json');
const { readdirSync } = require('fs');

const slash = [];
// Grab all the command files from the slash directory you created earlier
const commandFolder = readdirSync('../slash');
// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const folder of commandFolder) {
    const commandFile = readdirSync(`../slash/${folder}`).filter(files => files.endsWith(".js"));
    for (const file of commandFile) {
        const command = require(`../slash/${folder}/${file}`);
        slash.push(command.data.toJSON());
    }
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(Token);

// and deploy your slash!
(async () => {
	try {
		console.log(`Started refreshing ${slash.length} application (/) slash.`);

		// The put method is used to fully refresh all slash in the guild with the current set
		const data = await rest.put(
			Routes.applicationGuildCommands(ClientId, GuildId),
			{ body: slash },
		);

		console.log(`Successfully reloaded ${data.length} application (/) slash.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();