import { Guild } from "discord.js";
import { BotEvent } from "../types";
import { createGuildDatabase } from "../function";

const event: BotEvent = {
    name: "guildCreate",
    execute: async (guild : Guild) => {
        return await createGuildDatabase(guild);
    }
}

export default event;