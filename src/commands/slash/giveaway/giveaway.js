"use strict";
const {
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder
} = require('discord.js');
var [
    _trainer, 
    _master, 
    _booster, 
    _donor, 
    _bigdonor, 
    _kingdonor
] = 
[
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
    .setDescription('Tổ chức giveaway.')
    .addSubcommand(subcommand =>
        subcommand
        .setName('create')
        .setDescription('Tạo giveaway.')
        .addStringOption(option =>
            option
            .setName('item')
            .setDescription('Vật phẩm giveaway.')
            .setMaxLength(1000)
            .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('role')
            .setDescription('Role để tham gia Giveaway')
            .setRequired(true)
            .addChoices(
                {
                    name: 'Pokémon Trainer',
                    value: _trainer
                }, 
                {
                    name: 'Pokémon Master',
                    value: _master
                }, 
                {
                    name: 'Server Booster',
                    value: _booster
                }, 
                {
                    name: 'Donor',
                    value: _donor
                }, 
                {
                    name: 'Big Donor',
                    value: _bigdonor
                }, 
                {
                    name: 'King Donor',
                    value: _kingdonor
                }
            )
        )
        .addStringOption(option =>
            option
            .setName('duration')
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
            option.setName('requirement')
            .setDescription('Yêu cầu của buổi Giveaway.')
        )
        .addIntegerOption(option =>
            option.setName('winner')
            .setDescription('Số người thắng (mặc định là 1)')
        )
        .addStringOption(option =>
            option.setName('description')
            .setDescription('Mô tả về giveaway')
        )
        .addAttachmentOption(option =>
            option
            .setName("image")
            .setDescription("Thêm hình ảnh Giveaway")
        )
    ),
    async execute(interaction, client) {
        if (interaction.options.getSubcommand() === 'create') {
            const item = interaction.options.getString('item');
            const role = interaction.options.getString('role');
            const duration = interaction.options.getString('duration');
            const winner = interaction.options.getInteger('winner') ?? 1;

            const giveawayEmbed = new EmbedBuilder();
            giveawayEmbed.setColor(0xffffff);
            giveawayEmbed.setAuthor(
                {
                    name: 'Twilight Pokémon Việt Nam',
                    iconURL: 'https://user-images.githubusercontent.com/116461839/201083708-05244c2f-354a-4e9d-8eba-df4528287e7e.gif'
                }
            );
            giveawayEmbed.setTitle(item);
            giveawayEmbed.setDescription(`Thời gian: ${duration}\nNgười tham gia: \`0\``);
            giveawayEmbed.addFields(
                {
                    name: 'Giveaway',
                    value: `Role yêu cầu: <@&${role}>.\nSố người thắng: ${winner}.`
                }
            );
            giveawayEmbed.setTimestamp(end_time)
            giveawayEmbed.setFooter(
                {
                    text: user.tag,
                    iconURL: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.jpeg`
                }
            );
            const button_join_giveaway = new ActionRowBuilder()
            button_join_giveaway.addComponents(
                    new ButtonBuilder()
                    .setCustomId('join_giveaway|' + interaction.id)
                    .setLabel('Tham gia giveaway')
                    .setStyle(ButtonStyle.Success),
            );
            client.emit('giveawayEvent');
            await interaction.reply(
                {
                    embeds: [embed],
                    components: [button_join_giveaway],
                    fetchReply: true
                }
            );
        }
    }
};