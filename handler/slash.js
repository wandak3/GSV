const { readdirSync } = require('fs');

module.exports = (client, Client) => {
    const commandFolder = readdirSync('./slash');
    for (const folder of commandFolder) {
        const commandFile = readdirSync(`./slash/${folder}`).filter(files => files.endsWith(".js"));
        for (const file of commandFile) {
            const command = require(`../slash/${folder}/${file}`);
            if ('data' in command && 'execute' in command) {
        		client.commands.set(command.data.name, command);
        	} else {
        		console.log(`[WARNING] The command at ${commandFile} is missing a required "data" or "execute" property.`);
        	}
        }
    }
};