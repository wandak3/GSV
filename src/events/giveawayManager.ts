import { ChannelType, Client, Collection, EmbedBuilder } from "discord.js";
import { BotEvent, GuildGiveaway } from "../types";
import client from "..";

const event: BotEvent = {
    name: "giveawayManager",
    execute: async (client: Client) => {
        var giveaways = new Collection<string, GuildGiveaway[]>;
        setInterval(() => {
            client.database.forEach((value) => {
                giveaways.set(value.guildID, value.properties.giveawayList);
            });
            console.log(giveaways);
            /* giveaways.map(database => {
                database.map(data => {
                    if (data.time > Date.now()) {
                        console.log("giveaway complete");
                        const index = database.indexOf(data);
                        if (index > -1) {
                            database.splice(index, 1);
                            client.database
                        }
                    }
                });
            }); */
        }, 5000);
    }
}
const checkGiveaway = (giveaways: Collection<string, GuildGiveaway[]>) => {

}
const getWinner = async (client: Client) => {
    if (!client.doneGiveaway) return;
    const done = client.doneGiveaway[0];
    const channel = client.channels.cache.get(done.channel);
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