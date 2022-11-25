const { readdirSync } = require('fs');

module.exports = (client, Client, Users) => {
    const eventFolder = readdirSync('./events');
    for (const folder of eventFolder) {
        const eventFile = readdirSync(`./events/${folder}`).filter(files => files.endsWith(".js"));
        for (const file of eventFile) {
            const event = require(`../events/${folder}/${file}`);
            if (event.once) {
                client.once(event.name, async (...args) => event.execute(...args, client, Client, Users));
            } else {
                client.on(event.name, async (...args) => event.execute(...args, client, Client, Users));
            }
        }
    }
};