import { Client } from "discord.js";
import { BotEvent } from "../types";
import { checkGuildDatabase } from "../function";
import client from "../index";

const event : BotEvent = {
    name: "ready",
    once: true,
    execute: async (client : Client): Promise<void> => {
        console.log('Logged in as ' + client.user?.tag)
        client.emit('giveawayCreate');
        client.guilds.cache.map( async guild => {
            await checkGuildDatabase(guild);
        });
    }
}

export default event;