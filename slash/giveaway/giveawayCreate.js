const {
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder
} = require('discord.js');
const {
    Pokedex
} = require('../../config/pokedex.json');
const autocorrect = require('autocorrect')({
    words: Pokedex
});
var moment = require('moment');
const Giveaway = require("../../models/giveaway.js");
const Reroll = require("../../models/reroll.js");
var [_trainer, _master, _booster, _donor, _bigdonor, _kingdonor] = [
    '936835632695762954',
    '936833835944009809',
    '813047480413454359',
    '773778739515228160',
    '773780261435211798',
    '773785405874634802'
];
module.exports = {
    data: new SlashCommandBuilder()
        .setName('giveaway')
        .setDescription('Tổ chức buổi giveaway.')
        // create Myuu giveaway
        .addSubcommand(subcommand =>
            subcommand
            .setName('create')
            .setDescription('Tạo buổi giveaway với phần quà Myuu.')
            .addUserOption(option =>
                option
                .setName('user')
                .setDescription('Người tổ chức buổi giveaway.')
                .setRequired(true)
            )
            .addStringOption(option =>
                option
                .setName('time') //Giveaway time
                .setDescription('Thời gian diễn ra buổi giveaway.')
                .setRequired(true)
                .addChoices({
                    name: '1 giờ',
                    value: '1'
                }, {
                    name: '2 giờ',
                    value: '2'
                }, {
                    name: '4 giờ',
                    value: '4'
                }, {
                    name: '12 giờ',
                    value: '12'
                }, {
                    name: '24 giờ',
                    value: '24'
                }, {
                    name: '36 giờ',
                    value: '36'
                }, {
                    name: '48 giờ',
                    value: '48'
                })
            )
            .addStringOption(option =>
                option.setName('role') //Giveaway description
                .setDescription('Role để tham gia Giveaway')
                .setRequired(true)
                .addChoices({
                    name: 'Pokémon Trainer',
                    value: _trainer
                }, {
                    name: 'Pokémon Master',
                    value: _master
                }, {
                    name: 'Server Booster',
                    value: _booster
                }, {
                    name: 'Donor',
                    value: _donor
                }, {
                    name: 'Big Donor',
                    value: _bigdonor
                }, {
                    name: 'King Donor',
                    value: _kingdonor
                }))
            .addStringOption(option =>
                option.setName('requirement') //Giveaway description
                .setDescription('Yêu cầu để tham gia buổi Giveaway.'))
            .addIntegerOption(option =>
                option.setName('winner')
                .setDescription('Số người thắng (mặc định là 1)'))
            .addStringOption(option =>
                option.setName('description') //Giveaway custom
                .setDescription('Mô tả về giveaway'))
            .addStringOption(option =>
                option
                .setName('pokemon') //Giveaway pokemon name
                .setDescription('Tên pokemon được dùng để giveaway (thêm chữ shiny nếu là shiny).')
            )
            .addAttachmentOption(option =>
                option
                .setName("image")
                .setDescription("Thêm hình ảnh Giveaway"))),
    moderator: true,
    async execute(interaction, client) {
        if (interaction.options.getSubcommand() === 'create') {
            const user = interaction.options.getUser('user');
            const role = interaction.options.getString('role');
            const number = interaction.options.getInteger('winner') ?? 1;
            const time = interaction.options.getString('time');
            const requirement = interaction.options.getString('requirement');
            const description = interaction.options.getString('description');
            const image = interaction.options.getAttachment('image');
            var pokemon = interaction.options.getString('pokemon');

            const now = Date.now();
            const add_time = new Date(Number(time) * 1000 * 60 * 60).getTime();
            let end_time = new Date(add_time + now);
            let mom = moment(add_time).format("HH giờ mm");

            var title = "";
            var thumbnail = "";
            var sprite = "";
            var shiny = "normal";

            const embed = new EmbedBuilder()
                .setColor(0xffffff)
                .setAuthor({
                    name: 'Twilight Pokémon Việt Nam',
                    iconURL: 'https://user-images.githubusercontent.com/116461839/201083708-05244c2f-354a-4e9d-8eba-df4528287e7e.gif'
                });
            const button = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId('join_giveaway|' + interaction.id)
                    .setLabel('Tham gia giveaway')
                    .setStyle(ButtonStyle.Success),
                );

            if (description) {
                embed.addFields({
                    name: 'Mô tả giveaway',
                    value: description
                });
            }
            if (image) {
                title = `Giveaway`;
                thumbnail = 'https://user-images.githubusercontent.com/116461839/203118961-64a00956-8a3e-4928-aa6b-66821d16c4e2.png';
                embed
                    .setTitle(`Giveaway`)
                    .setImage(image.url)
                    .setThumbnail('https://user-images.githubusercontent.com/116461839/203118961-64a00956-8a3e-4928-aa6b-66821d16c4e2.png');
            }
            if (pokemon) {
                sprite = autocorrect(pokemon);
                if (pokemon.toLowerCase().includes("shiny")) {
                    pokemon.replace("shiny", "★");
                    shiny = "shiny";
                }
                title = `Giveaway ${pokemon}`;
                thumbnail = `https://img.pokemondb.net/sprites/black-white/${shiny}/${sprite}.png`;
                embed
                    .setTitle(`Giveaway ${pokemon}`)
                    .setThumbnail(`https://img.pokemondb.net/sprites/black-white/${shiny}/${sprite}.png`);
            }

            embed
                .setDescription(`Thời gian còn lại của giveaway: \`${mom}\` giờ.\nSố người tham gia hiện tại: \`0\``)
                .addFields({
                    name: 'Giveaway',
                    value: `Được tổ chức bởi: <@${user.id}>.\nRole yêu cầu: <@&${role}>.\nSố người thắng: ${number}.`
                })
                .setTimestamp(end_time)
                .setFooter({
                    text: user.tag,
                    iconURL: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.jpeg`
                });

            if (requirement) {
                embed.addFields({
                    name: 'Requirement',
                    value: requirement
                });
            }
            
            embed
                .addFields({
                    name: '\u200B',
                    value: '**Entries:**\n- <@&773785405874634802>: 3 entries\n- <@&813047480413454359>: 2 entries\n- <@&773780261435211798>: 2 entries\n- <@&773778739515228160>: 1 entries'
                });
            const message = await interaction.reply({
                embeds: [embed],
                components: [button],
                fetchReply: true
            });
            await Giveaway.create({
                _id: interaction.id,
                channel: interaction.channelId,
                message: message.id,
                role: role,
                winner: number,
                title: title,
                thumbnail: thumbnail,
                attachment: image.url,
                description: description,
                time: end_time
            });

            await Reroll.create({
                _id: interaction.id,
                winner: number,
                title: title,
                thumbnail: thumbnail,
            });

            return await client.emit("giveawayCreate");
        }
    },
};