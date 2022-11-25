const {
    SlashCommandBuilder,
    EmbedBuilder
} = require('discord.js');
const BlackList = require("../../models/blackList.js");
module.exports = {
    data: new SlashCommandBuilder()
        .setName('block')
        .setDescription('Chặn đếm người dùng.')
        .addSubcommand(subcommand =>
            subcommand
            .setName('add')
            .setDescription('Thêm chặn bộ đếm người dùng.')
            .addUserOption(option => option.setName('user').setDescription('The user').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
            .setName('remove')
            .setDescription('Tháo chặn bộ đếm người dùng.')
            .addUserOption(option => option.setName('user').setDescription('The user').setRequired(true))),
    async execute(interaction, client) {
        const embed = new EmbedBuilder()
            .setColor(0xffffff)
            .setTimestamp();
        if (interaction.options.getSubcommand() === 'add') {
            const user = interaction.options.getUser('user');
            try {
                await BlackList.create({
                    _id: user.id
                });
                embed.setDescription(`Đã chặn bộ đếm của ${user.tag}.`);
            } catch {
                embed.setDescription(`Người dùng ${user.tag} đã có trong danh sách chặn.`);
            }

            embed
                .setAuthor({
                    name: user.tag
                })
                .setDescription(`Đã chặn bộ đếm của ${user.tag}.`)
                .setFooter({
                    text: user.tag,
                    iconURL: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.jpeg`
                });

        } else if (interaction.options.getSubcommand() === 'remove') {
            const user = interaction.options.getUser('user');
            try {
                await BlackList.destroy({
                    where: {
                        _id: user.id
                    }
                });
                embed.setDescription(`Đã tháo chặn bộ đếm của ${user.tag}. Người dùng có thể chat để tăng điểm trở lại.`);
            } catch {
                embed.setDescription(`Không tìm thấy ${user.tag} trong danh sách chặn.`);
            }
            embed
                .setAuthor({
                    name: user.tag
                })
                .setFooter({
                    text: user.tag,
                    iconURL: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.jpeg`
                });
            await BlackList.destroy({
                where: {
                    _id: user.id
                }
            });
        }

        return await interaction.reply({
            embeds: [embed]
        });
    },
};