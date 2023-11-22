import {
	SlashCommandBuilder,
	PermissionFlagsBits,
	CommandInteraction,
	EmbedBuilder,
	ButtonBuilder,
	ActionRowBuilder,
	ButtonStyle,
} from 'discord.js';
import {SlashCommand} from '../types';
import {setGuildOption} from '../function';

const command: SlashCommand = {
	command: new SlashCommandBuilder()
		.setName('setting')
		.setDescription('Cài đặt bot')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addSubcommand((subcommand) => subcommand.setName('database').setDescription('Thay đổi database bot sử dụng')),
	cooldown: 1,
	execute: async (interaction: CommandInteraction) => {
		if (!interaction.isChatInputCommand()) return;
		const embed = new EmbedBuilder()
			.setAuthor({
				name: 'WumPS',
			})
			.setColor('#404eed')
			.setTitle('Chọn database để sử dụng')
			.setDescription('Vui lòng chọn database để sử dụng cho bot')
			.setTimestamp()
			.setFooter({
				text: 'GM Helper Bot',
				iconURL: 'https://ik.imagekit.io/asiatarget/genshin/icon_128x128.png?updatedAt=1699385494260',
			});
		let row = new ActionRowBuilder<ButtonBuilder>();
		const official = new ButtonBuilder()
			.setCustomId('official')
			.setLabel('Server chính thức')
			.setStyle(ButtonStyle.Success);
		const test = new ButtonBuilder().setCustomId('test').setLabel('Server thử nghiệm').setStyle(ButtonStyle.Success);
		row.addComponents(official, test);
		const response = await interaction.reply({
			embeds: [embed],
			components: [row],
		});
		const collectorFilter = (i: any) => i.user.id === interaction.user.id;
		try {
			const confirmation = await response.awaitMessageComponent({filter: collectorFilter, time: 60_000});
			if (confirmation.customId === 'official') {
				if (!interaction.guild) return interaction.editReply('Không thể thay đổi database ở DM');
				await setGuildOption(interaction.guild, 'link', 'mysql://root:Wumpus@2023@35.215.146.105:3306/db_hk4e_config');
				await setGuildOption(interaction.guild, 'address', '35.215.146.105');
				await confirmation.update({
					content: `Thay đổi thành công sang phiên bản chính thức`,
					embeds: [],
					components: [],
				});
			} else if (confirmation.customId === 'test') {
				if (!interaction.guild) return interaction.editReply('Không thể thay đổi database ở DM');
				await setGuildOption(interaction.guild, 'link', 'mysql://root:Wumpus@2023@35.215.183.254:3306/db_hk4e_config');
				await setGuildOption(interaction.guild, 'address', '35.215.183.254');
				await confirmation.update({
					content: 'Thay đổi thành công sang phiên bản thử nghiệm',
					embeds: [],
					components: [],
				});
			}
		} catch (e) {
			console.log(e);
			await interaction.editReply({
				content: 'Không có lựa chọn nào được đưa ra. Hủy yêu cầu',
				embeds: [],
				components: [],
			});
		}
	},
};

export default command;
