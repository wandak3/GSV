const { readdirSync } = require('fs');

module.exports = (client, Client) => {
    const commandFolder = readdirSync('./commands');
    for (const folder of commandFolder) {
        const commandFile = readdirSync(`./commands/${folder}`).filter(files => files.endsWith(".js"));
        for (const file of commandFile) {
            const command = require(`../commands/${folder}/${file}`);
            client.commands.set(command.name, command);
        }
    }
};