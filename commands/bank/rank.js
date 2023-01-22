const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js');
const Donate = require("../../models/donate.js");
module.exports = {
    name: "rank",
    aliases: ['rank'],
    usage: "Check rank bank donation.",
    moderator: false,
    timeout: 3000,
    async execute(message, args, commandName, client) {
        const db = await Donate.find().sort({
            "balance": -1,
            "credit": -1
        }).exec();
        let fitPage = 0;
        const generateEmbed = async start => {
            const current = db.slice(start, start + 5);
            fitPage = current.length;
            return new EmbedBuilder()
                .setTitle("Bảng xếp hạng Donate Server")
                .setColor(0xffffff)
                .setThumbnail("https://user-images.githubusercontent.com/116461839/204733874-18b4abe9-fb63-42a1-a948-26af456ab1a6.png")
                .setAuthor({
                    name: 'Twilight Pokémon Việt Nam',
                    iconURL: "https://user-images.githubusercontent.com/116461839/201083708-05244c2f-354a-4e9d-8eba-df4528287e7e.gif"
                })
                .setTimestamp()
                .setFooter({ 
                    text: client.user.tag,
                    iconURL: `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.jpeg` 
                })
                .addFields(await Promise.all(
                    current.map(async (currentValue, index) => ({
                        name: start + index + 1 + ". " + await getUser(client, currentValue._id),
                        value: `Donate: ${currentValue.balance} <:pkc:1047212783072190484> **|** Tín dụng: ${currentValue.credit} điểm.`
                    }))
                ));
        };
        const _nextButton = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId('next|' + message.id)
                .setLabel('Tiếp theo')
                .setStyle(ButtonStyle.Success),
            );
        const _backButton = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId('back|' + message.id)
                .setLabel('Trang trước')
                .setStyle(ButtonStyle.Success),
            );
        const _Button = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId('back|' + message.id)
                .setLabel('Trang trước')
                .setStyle(ButtonStyle.Success),
            ).addComponents(
                new ButtonBuilder()
                .setCustomId('next|' + message.id)
                .setLabel('Tiếp theo')
                .setStyle(ButtonStyle.Success),
            );
        let currentIndex = 0;
        const msg = await message.channel.send({
            embeds: [await generateEmbed(0)],
            components: [_nextButton]
        });
        const collector = i => i.user.id === message.author.id;
        const _collector = msg.channel.createMessageComponentCollector({
            collector,
            idle: 10000
        });
        await _collector.on('collect', async page => {
            page.customId === `back|${message.id}` ? (currentIndex -= 5) : (currentIndex += 5);
            var button;
            const editEmbed = await generateEmbed(currentIndex);
            if (currentIndex === 0) button = _nextButton;
            else if (fitPage % 5 === 0) button = _Button;
            else button = _backButton;
            await page.update({
                embeds: [editEmbed],
                components: [button]
            });
        });
        await _collector.on('end', collected => {
            const editEmbed = msg.embeds[0];
            const _editEmbed = EmbedBuilder.from(editEmbed)
                .setFooter({ 
                    text: "Time's up.", 
                    iconURL: `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.jpeg` 
                })
                .setTimestamp();
            msg.edit({
                embeds: [_editEmbed],
                components: []
            });
        });
    }
};
async function getUser(client, _id) {
    const user = await client.users.fetch(_id);
    return user.tag;
}