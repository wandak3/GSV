import { Interaction } from "discord.js";
import { BotEvent } from "../types";

const event : BotEvent = {
    name: "giveawayCreate",
    execute: (interaction: Interaction) => {
        if (!interaction.isButton()) return;
        if (interaction.customId?.includes('joinGiveaway')) {
            
        }
    }
}

export default event;