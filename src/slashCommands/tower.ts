import {SlashCommandBuilder, PermissionFlagsBits, CommandInteraction, EmbedBuilder, AttachmentBuilder} from 'discord.js';
import {SlashCommand} from '../types';
import { getTowerBin, pagination } from '../function';
import { Avatar } from '../data/avatar';

const command: SlashCommand = {
	command: new SlashCommandBuilder()
		.setName('tower')
		.setDescription('Kiểm tra stats La Hoàn')
		.addStringOption((option) => option.setName('uid').setDescription('UID của người chơi').setRequired(true)),
	cooldown: 1,
	execute: async (interaction: CommandInteraction) => {
		if (!interaction.isChatInputCommand()) return;
		if (!interaction.guild) return interaction.reply('Không thể thực hiện ở DM');
		const ip = process.env.IP;
		const uid = interaction.options.getString('uid', true);
        await interaction.deferReply();
        await interaction.followUp('Đang tìm kiếm thông tin, vui lòng chờ trong giây lát...');
        const response = await getTowerBin(uid);
        if (!response) return interaction.editReply('Không tìm thấy thông tin');
        const summary = response.tower_monthly_summary_map;
        let embeds: EmbedBuilder[] = [];
        for (let i = 0; i < Object.keys(summary).length; i++) {
            const embed = new EmbedBuilder()
                .setTitle('Bảng thông tin la hoàn')
                .setColor('#404eed')
                .setTimestamp()
                .setFooter({
                    text: `${response.nickname}`,
                    iconURL: 'https://ik.imagekit.io/asiatarget/genshin/icon_128x128.png?updatedAt=1699385494260',
                });
            const name = Object.keys(summary)[i]
            const highest_dps = summary[name]?.monthly_combat_summary?.highest_dps_avatr_pair;
            const most_take_damage = summary[name]?.monthly_combat_summary?.most_take_damage_avatar_pair;
            embed.addFields({
                name: `ID La Hoàn: ${name}`,
                value: `**Số tầng cao nhất clear:** ${summary[name]?.best_floor_index}`
            });
            embed.addFields({
                name: `Nhân vật DMG to nhất: ${Avatar[highest_dps?.avatar_id]}`,
                value: `**Damage gây ra:** ${highest_dps?.data.toLocaleString()}`
            });
            embed.addFields({
                name: `Nhân vật chống chịu tốt nhất: ${Avatar[most_take_damage?.avatar_id]}`,
                value: `**Damage nhận vào:** ${most_take_damage?.data.toLocaleString()}`,
            });
            const file_name = `${Avatar[highest_dps?.avatar_id].replace(' ', '_')}_Icon`;
            embed.setThumbnail(`https://ik.imagekit.io/asiatarget/avatar/${file_name}.png?updatedAt=1712677263090`);
            embeds.push(embed);
        }
        await pagination(interaction, embeds, 45000);
	},
};

export default command;
