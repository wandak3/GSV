const SQLite = require("../../models/message.js");
const BlackList = require("../../models/blackList.js");
const mongoose = require('mongoose');
const url = "mongodb+srv://nhocsake:quaylen123@account.uu5c73r.mongodb.net/?retryWrites=true&w=majority";

module.exports = {
    name: 'ready',
    async execute(client) {
        console.log(`${client.user.tag} - ${client.user.id} online!`);
        client.emit("giveawayCreate");
        SQLite.sync();
        BlackList.sync();
        await mongoose.connect(url)
        .then(console.log("Bot connected to Server Bot database."))
        .catch((err) => {
            console.log("Bot not Connected to Database ERROR! ", err);
        });
    }
};