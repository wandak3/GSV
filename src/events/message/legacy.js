const { Prefix } = require('../../config/config.json');
const Timeout = new Set();

module.exports = {
    name: 'messageCreate',
    async execute(message, client, Client) {
        if (message.guildId === null) return;
        if (!message.content.startsWith(Prefix)) return;
        const args = message.content.slice(Prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        const command = client.commands.get(commandName) ||
            client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        if (!command) return;
        const timeout = Number(command.timeout);
        if (Timeout.has(`${message.author.id}${command.name}`)) return;
        else {
            Timeout.add(`${message.author.id}${command.name}`);
            setTimeout(() => {
                Timeout.delete(`${message.author.id}${command.name}`);
            }, timeout);
        }
        await command.execute(message, args, commandName, client, Client);
    }
};