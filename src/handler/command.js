const { readdirSync } = require('fs');

module.exports = (client) => {
    const commandFolder = readdirSync('./src/commands/legacy');
    for (const folder of commandFolder) {
        const commandFile = readdirSync(`./src/commands/legacy/${folder}`).filter(files => files.endsWith(".js"));
        for (const file of commandFile) {
            const command = require(`../commands/legacy/${folder}/${file}`);
            client.commands.set(command.name, command);
        }
    }
};