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
const Giveaway = require("../../models/giveaway.js");
const Reroll = require("../../models/reroll.js");
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
                .setName('time') //GA time
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
                option.setName('role') //GA description
                .setDescription('Role để tham gia Giveaway')
                .setRequired(true)
                .addChoices({
                    name: 'Pokémon Trainer',
                    value: '1045345685114982400'
                }, {
                    name: 'Pokémon Master',
                    value: '1045345756426555493'
                }, {
                    name: 'Server Booster',
                    value: '1044130637583499314'
                }, {
                    name: 'Donor',
                    value: '1044569861856182332'
                }, {
                    name: 'Big Donor',
                    value: '1044569912473042974'
                }, {
                    name: 'King Donor',
                    value: '1044569945478012928'
                }))
            .addStringOption(option =>
                option.setName('requirement') //GA description
                .setDescription('Yêu cầu để tham gia buổi Giveaway.'))
            .addIntegerOption(option =>
                option.setName('winner')
                .setDescription('Số người thắng (mặc định là 1)'))
            .addStringOption(option =>
                option.setName('description') //GA description
                .setDescription('Mô tả cho buổi giveaway (tuỳ chọn)'))
            .addStringOption(option =>
                option
                .setName('pokemon') //GA pokemon name
                .setDescription('Tên pokemon được dùng để giveaway (thêm chữ shiny nếu là shiny).')
            )
            .addAttachmentOption(option =>
                option
                .setName("image")
                .setDescription("Thêm hình ảnh Giveaway"))
            .addIntegerOption(option =>
                option
                .setName('pkc') //GA pkc number
                .setDescription('Số lượng pkc được dùng để giveaway.')
            )),
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
            if (pokemon) {
                sprite = autocorrect(pokemon);
                if (pokemon.toLowerCase().includes("shiny")) {
                    pokemon.replace("shiny", "★");
                    shiny = "shiny";
                }
            }

            if (!pokemon && !image && !description) {
                embed.setDescription(`Một buổi giveaway cần phải có mô tả`);
                return await interaction.reply({
                    embeds: [embed]
                });
            } else if (!pokemon && !image && !image) {
                title = `GA ${description}`;
                thumbnail = 'https://user-images.githubusercontent.com/116461839/201083708-05244c2f-354a-4e9d-8eba-df4528287e7e.gif';
                embed
                    .setTitle(`GA ${description}`)
                    .setThumbnail('https://user-images.githubusercontent.com/116461839/201083708-05244c2f-354a-4e9d-8eba-df4528287e7e.gif');
            } else if (!description) {
                if (!pokemon) {
                    title = `Giveaway`;
                    thumbnail = 'https://user-images.githubusercontent.com/116461839/203118961-64a00956-8a3e-4928-aa6b-66821d16c4e2.png';
                    embed
                        .setTitle(`Giveaway`)
                        .setImage(image.url)
                        .setThumbnail('https://user-images.githubusercontent.com/116461839/203118961-64a00956-8a3e-4928-aa6b-66821d16c4e2.png');
                } else if (!image) {
                    title = `GA ${pokemon}`;
                    thumbnail = `https://img.pokemondb.net/sprites/black-white/${shiny}/${sprite}.png`;
                    embed
                        .setTitle(`GA ${pokemon}`)
                        .setThumbnail(`https://img.pokemondb.net/sprites/black-white/${shiny}/${sprite}.png`);
                }
            }

            const current_time = Date.now();
            const end_time = new Date(current_time + Number(time) * 1000).getTime();

            embed
                .addFields({
                    name: 'Giveaway',
                    value: `Được tổ chức bởi: <@${user.id}>.\nSố người thắng: ${number}.\nThời gian kết thúc: \`${time}\` giờ.`
                }, {
                    name: '\u200B',
                    value: `Requirement: ${requirement}`
                }, {
                    name: '\u200B',
                    value: '**Entries:**\n- <@&773785405874634802>: 3 entries\n- <@&813047480413454359>: 2 entries\n- <@&773780261435211798>: 2 entries\n- <@&773778739515228160>: 1 entries'
                })
                .setTimestamp(end_time)
                .setFooter({
                    text: user.tag,
                    iconURL: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.jpeg`
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
                requirement: requirement,
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