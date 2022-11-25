const Giveaway = require("../../models/giveaway.js");
const Reroll = require("../../models/reroll.js");
const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder
} = require('discord.js');
module.exports = {
    name: "giveawayCreate",
    async execute(client) {
        client.giveaway = await Giveaway.find();
        const countdown = setInterval(async () => {
            const giveaway = client.giveaway;
            if (!giveaway.length) return clearInterval(countdown);
            for (let i = 0; i < giveaway.length; i++) {
                const now = Date.now();
                if (now > giveaway[i].time) {
                    const _id = giveaway[i]._id;
                    const winner = giveaway[i].winner;
                    const thumbnail = giveaway[i].thumbnail;
                    const title = giveaway[i].title;
                    let join = giveaway[i].join;
                    const channel = await client.channels.fetch(giveaway[i].channel)
                        .catch(async (err) => {
                            if (err.code === 10003) {
                                console.log("Unable to find Channel with id: " + giveaway[i].channel);
                                await removeGiveaway(client, _id);
                            }
                        });
                    const message = await channel?.messages.fetch(giveaway[i].message)
                        .catch(async (err) => {
                            if (err.code === 10008) {
                                console.log("Unable to find Message with id: " + giveaway[i].message);
                                await removeGiveaway(client, _id);
                            }
                        });
                    if (!message) {
                        await removeGiveaway(client, _id);
                        continue;
                    }
                    if (!join.length) {
                        const noEmbed = new EmbedBuilder()
                            .setThumbnail(thumbnail)
                            .setColor(0xffffff)
                            .setTimestamp()
                            .setAuthor({
                                name: 'Twilight Pokémon Việt Nam',
                                iconURL: 'https://user-images.githubusercontent.com/116461839/201083708-05244c2f-354a-4e9d-8eba-df4528287e7e.gif'
                            })
                            .setDescription("Giveaway kết thúc mà không có người tham gia.")
                            .setFooter({
                                text: 'Twilight Pokémon Việt Nam'
                            });
                        await message.edit({
                            embeds: [noEmbed],
                            components: []
                        });
                        await removeGiveaway(client, _id);
                        continue;
                    }
                    let winner_list = [];
                    for (let j = 0; j < winner; j++) {
                        let rand = random(0, join.length-1);
                        winner_list.push(join[rand]);
                        join = join.filter(item => item !== join[rand]);
                    }
                    let description = "";
                    for (let i = 0; i < winner_list.length; i++) {
                        description += `Chúc mừng <@${winner_list[i]}>, bạn đã trúng giải thưởng ${title.replace("","")}.\n`;
                    }
                    const editEmbed = new EmbedBuilder()
                        .setThumbnail(thumbnail)
                        .setColor(0xffffff)
                        .setTimestamp()
                        .setDescription(description)
                        .setAuthor({
                            name: 'Twilight Pokémon Việt Nam',
                            iconURL: 'https://user-images.githubusercontent.com/116461839/201083708-05244c2f-354a-4e9d-8eba-df4528287e7e.gif'
                        })
                        .setTitle('Danh sách trúng Giveaway')
                        .setFooter({
                            text: 'Twilight Pokémon Việt Nam'
                        });
                    const reroll_button = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                            .setCustomId('reroll|' + _id)
                            .setLabel('Re-roll')
                            .setStyle(ButtonStyle.Primary),
                        );
                    await message.edit({
                        embeds: [editEmbed],
                        components: [reroll_button]
                    });
                    await Reroll.findOneAndUpdate({
                        _id: _id
                    }, {
                        $set: {
                            join: giveaway[i].join
                        }
                    });
                    await removeGiveaway(client, _id);
                    continue;
                }
            }
        }, 1000);
    }
};

async function removeGiveaway(client, _id) {
    await Giveaway.findOneAndRemove({
        _id: _id
    });
    client.giveaway = await Giveaway.find();
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}