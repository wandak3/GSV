const { Prefix } = require('../../config/config.json');
const Timeout = new Set();

module.exports = {
    name: 'messageCreate',
    async execute(message, client, Client) {
        if (message.guildId === null) return;

        /**
         * prefix-handler
         * @param { Client } client
         * @param { Message } message
         **/
        
        if (!message.content.startsWith(Prefix)) return;
        const args = message.content.slice(Prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        const command = client.commands.get(commandName) ||
            client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        if (!command) return;
        const moderator = command.moderator;
        if(moderator === true) {
            if (!message.member.roles.cache.has("912330014702313492") && !message.member.roles.cache.has("805707274530062356") && !message.member.roles.cache.has("1035041217756545064")) {
                return;
            }
        }

        /**
         * timeout
         **/

        const timeout = Number(command.timeout);
        if (Timeout.has(`${message.author.id}${command.name}`)) return;
        else {
            Timeout.add(`${message.author.id}${command.name}`);
            setTimeout(() => {
                Timeout.delete(`${message.author.id}${command.name}`);
            }, timeout);
        }
        await command.execute(message, args, commandName, client, Client)
            .catch(err => {
                if (err.message.includes("missing SEND_MESSAGES permission")) return;
                else if (err.message.includes("missing USE_APPLICATION_COMMANDS permission")) return message.reply("I don't have permission to send Slash Command.");
                else console.log(err);
            });
    }
};