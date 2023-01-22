const SQLite = require("../../models/message.js");
const BlackList = require("../../models/blackList.js");
const { CountId, Prefix } = require("../../config/config.json");

module.exports = {
    name: 'messageCreate',
    async execute(message, client, Client) {
        if (message.author.bot) return;
        if (message.content.startsWith(Prefix)) return;
        if (!CountId.includes(message.channel.id)) return;
        const blackList = await BlackList.findOne({ where: { _id: message.author.id } });
        if(blackList) return;
        try {
            await SQLite.create({
                _id: message.author.id,
                message_number: 1
            });
        } catch (err) {
            if (err.name === 'SequelizeUniqueConstraintError') {
                await SQLite.increment('message_number', {
                    by: 1,
                    where: {
                        _id: message.author.id
                    }
                });
                const user = await SQLite.findOne({ where: { _id: message.author.id } });
                if(user.get('message_number') > 2000) {}
            } else console.log(err);
        }
    }
};