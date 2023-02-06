import { Interaction } from "discord.js";
import { BotEvent, GuildGiveaway } from "../types";
import { checkTime, getGuildProperties } from "../function";

const event : BotEvent = {
    name: "giveawayCreate",
    execute: async (interaction: Interaction) => {
        let giveaways = await getGuildProperties(interaction.guild, 'giveawayList') as GuildGiveaway[];
        setInterval(async () => {
            let getTime = giveaways.forEach(giveaway => {
                return checkTime(giveaway.time)
            });
            console.log(getTime);
        }, 5000);
    }
}

export default event;