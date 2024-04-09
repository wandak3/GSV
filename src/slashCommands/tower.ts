import {SlashCommandBuilder, PermissionFlagsBits, CommandInteraction, EmbedBuilder, AttachmentBuilder} from 'discord.js';
import {SlashCommand} from '../types';
import { getTowerBin, pagination } from '../function';
import { Avatar } from '../data/avatar';

const command: SlashCommand = {
	command: new SlashCommandBuilder()
		.setName('tower')
		.setDescription('Kiểm tra DPS La Hoàn')
		.addStringOption((option) => option.setName('uid').setDescription('UID của người chơi').setRequired(true)),
	cooldown: 1,
	execute: async (interaction: CommandInteraction) => {
		if (!interaction.isChatInputCommand()) return;
		if (!interaction.guild) return interaction.reply('Không thể thực hiện ở DM');
		const ip = process.env.IP;
		const uid = interaction.options.getString('uid', true);
        await interaction.deferReply();
        const summary = await getTowerBin(uid);
        let embeds: EmbedBuilder[] = [];
        for (let i = 0; i < Object.keys(summary).length; i++) {
            const embed = new EmbedBuilder()
                .setTitle('Bảng thông tin la hoàn')
                .setColor('#404eed')
                .setTimestamp()
                .setFooter({
                    text: '[GM] WumPS',
                    iconURL: 'https://ik.imagekit.io/asiatarget/genshin/icon_128x128.png?updatedAt=1699385494260',
                });
            const name = Object.keys(summary)[i]
            const highest_dps = summary[name].monthly_combat_summary?.highest_dps_avatr_pair;
            const most_take_damage = summary[name].monthly_combat_summary?.most_take_damage_avatar_pair;
            embed.addFields({
                name: `Tên La Hoàn: ${name}`,
                value: `Số tầng clear: ${summary[name].best_floor_index}`
            });
            embed.addFields({
                name: `Nhân vật DMG to nhất: ${Avatar[highest_dps.avatar_id]}`,
                value: `Damage gây ra: ${highest_dps.data}`
            });
            embed.addFields({
                name: `Nhân vật DMG to nhất: ${Avatar[most_take_damage.avatar_id]}`,
                value: `Damage nhận vào: ${most_take_damage.data}`,
            });
            const file_name = `${Avatar[highest_dps.avatar_id].replace(' ', '_')}_Icon`;
            const file = new AttachmentBuilder(`../data/avatar/${file_name}.png`);
            embed.setThumbnail(`attachment://${file_name}.png`);
            embeds.push(embed);
        }
        await pagination(interaction, embeds, 45000, file);
	},
};

export default command;
