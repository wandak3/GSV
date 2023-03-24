import { ChannelType, Client, EmbedBuilder } from "discord.js";
import { BotEvent, GuildGiveaway } from "../types";
import client from "..";

const event: BotEvent = {
    name: "giveawayManager",
    execute: async (client: Client) => {
        let giveaways: GuildGiveaway[] = client.database.properties.giveawayList;
        setInterval(checkGiveaway, 1000, giveaways);
    }
}
const checkGiveaway = (giveaways: GuildGiveaway[]) => {
    giveaways.map(async (giveaway: GuildGiveaway) => {
        if (giveaway.time >= Date.now()) {
            const rand = Math.round(Math.random());
            const winner = giveaway.entries[rand];
            const channel = giveaway.channel;
            client.giveaway.push(
                {
                    giveaway: giveaway.id,
                    winner: winner,
                    channel: channel.id
                }
            );
        }
    });
}
const getWinner = async (client: Client) => {
    if (!client.giveaway) return;
    const done = client.giveaway[0];
    const channel = await client.channels.cache.get(done.channel);
    if (!channel || channel.type != ChannelType.GuildText) return;
    const giveawayEmbed = new EmbedBuilder();
    giveawayEmbed.setColor(0xffffff);
    giveawayEmbed.setAuthor(
        {
            name: 'Twilight Pokémon Việt Nam',
            iconURL: 'https://user-images.githubusercontent.com/116461839/201083708-05244c2f-354a-4e9d-8eba-df4528287e7e.gif'
        }
    );
    giveawayEmbed.setTitle("Giveaway winner");
    giveawayEmbed.setDescription("Winner: " + done.winner);
    await channel.send({
        embeds: [giveawayEmbed]
    });
}
export default event;