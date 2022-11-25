const SQLite = require("../../models/message.js");
const BlackList = require("../../models/blackList.js");

module.exports = {
    name: 'messageCreate',
    async execute(message, client, Client) {
        if (message.author.bot) return;
        if (message.channel.id != "1044060565531795526") return;
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
            } else console.log(err);
        }
    }
};