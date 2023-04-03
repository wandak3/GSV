import { BotEvent } from "../types";
import GuildModel from "../database/guild";
import { checkGuildDatabase } from "../function";
import client from "../index";

const event : BotEvent = {
    name: "ready",
    once: true,
    execute: async (): Promise<void> => {
        console.log('Logged in as ' + client.user?.tag);
        client.guilds.cache.map(async guild => await checkGuildDatabase(guild));
        const database = await GuildModel.find();
        database.map(data => {
            client.database.set(data.guildID, data);
        });
        client.emit("giveawayManager", client);
    }
}

export default event;