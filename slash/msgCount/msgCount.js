const {
    SlashCommandBuilder,
    EmbedBuilder
} = require('discord.js');
const SQLite = require("../../models/message.js");
module.exports = {
    data: new SlashCommandBuilder()
        .setName('message')
        .setDescription('Xem số lượng tin nhắn trong Server.')
        .addUserOption(option =>
            option
            .setName('user')
            .setDescription('Người dùng cần kiểm tra')
        ),
    async execute(interaction, client) {
        let user = interaction.options.getUser('user') ?? null;
        if(!user) user = interaction.user;
        const embed = new EmbedBuilder()
            .setAuthor({
                    name: user.tag
                })
            .setColor(0xffffff)
            .setTimestamp()
            .setFooter({
                text: user.tag,
                iconURL: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.jpeg`
            });
        const sqlite = await SQLite.findOne({ where: { _id: user.id } });
        if(!sqlite) {
            embed.setDescription(`Bạn đã nhắn được tổng cộng: \`0\` tin nhắn trong Server.`);
        } else {
            const message_number = sqlite.get('message_number');
            embed.setDescription(`Bạn đã nhắn được tổng cộng: \`${message_number}\` tin nhắn trong Server.`);
        }
        return await interaction.reply({ embeds: [embed] });
    },
};