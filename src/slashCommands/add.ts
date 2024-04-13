import {SlashCommandBuilder, PermissionFlagsBits, CommandInteraction} from 'discord.js';
import {SlashCommand} from '../types';
import fs from 'fs';
import path from 'path';
import prisma from '../prisma/prisma';
import moment from 'moment';

const command: SlashCommand = {
	command: new SlashCommandBuilder()
		.setName('add')
		.setDescription('Thêm vào SQL')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addStringOption((option) =>
			option.setName('event').setDescription('Tên sự kiện').setRequired(true).setAutocomplete(true)
		)
		.addStringOption((option) =>
			option
				.setName('enable')
				.setDescription('Bắt đầu ngay?')
				.addChoices({name: 'Có', value: '1'}, {name: 'Không', value: '0'})
		)
		.addStringOption((option) => option.setName('begin').setDescription('Thời gian bắt đầu'))
		.addStringOption((option) => option.setName('end').setDescription('Thời gian kết thúc')),
	// INSERT INTO `db_hk4e_config_gio`.`t_gacha_schedule_config` (`schedule_id`, `gacha_type`, `begin_time`, `end_time`, `cost_item_id`, `cost_item_num`, `gacha_pool_id`, `gacha_prob_rule_id`, `gacha_up_config`, `gacha_rule_config`, `gacha_prefab_path`, `gacha_preview_prefab_path`, `gacha_prob_url`, `gacha_record_url`, `gacha_prob_url_oversea`, `gacha_record_url_oversea`, `gacha_sort_id`, `enabled`, `title_textmap`, `display_up4_item_list`) VALUES (23, 302, '2024-03-27 00:00:00', '2024-04-11 00:00:00', 223, 1, 201, 2, '{\"gacha_up_list\":[{\"item_parent_type\":1,\"prob\":750,\"item_list\":[14512,12510]},{\"item_parent_type\":2,\"prob\":500,\"item_list\":[15405,11403,12401,13416,14409,15401]}]}', '{}', 'GachaShowPanel_A111', 'UI_Tab_GachaShowPanel_A111', '', '', '', '', 3, 1, 'UI_GACHA_SHOW_PANEL_A020_TITLE', '15405,11403,12401,13416,14409,15401');
	cooldown: 1,
	autocomplete: async (interaction) => {
		const jsonsInDir = fs.readdirSync('./src/data/references').filter((file) => path.extname(file) === '.json');
		const focusedOption = interaction.options.getFocused(true);
		let bannerList: {name: string; value: string}[] = [];
		jsonsInDir.forEach((file) => {
			const fileData = fs.readFileSync(path.join('./src/data/references', file));
			const json = JSON.parse(fileData.toString());
			json.forEach((data: any) => {
				const version = data.comment.substring(0, 6);
				const nameData =
					data.comment.substring(6).length == 0
						? `Signature of ${version}`
						: `${data.comment.substring(6)} on Version ${version}`;
				bannerList.push({name: nameData, value: file});
			});
		});
		const filtered: {name: string; value: string}[] = bannerList.filter((choice: any) => {
			return choice.name.includes(focusedOption.value);
		});
		const options = filtered.length > 25 ? filtered.slice(0, 25) : filtered;
		await interaction.respond(options);
	},
	execute: async (interaction: CommandInteraction) => {
		if (!interaction.isChatInputCommand()) return;
		if (!interaction.guild) return interaction.reply('Không thể thực hiện ở DM');
		const event = interaction.options.getString('event', true);
		const enable = interaction.options.getString('enable') ?? '0';
		const begin = interaction.options.getString('begin')
			? moment(interaction.options.getString('begin')).startOf('day').toISOString()
			: moment().startOf('day').toISOString();
		const end = interaction.options.getString('end')
			? moment(interaction.options.getString('end')).toISOString()
			: moment(begin).add(2, 'w').toISOString();
		try {
			const getFileData = fs.readFileSync(path.join('./src/data/references', event));
			const json = JSON.parse(getFileData.toString());
			json.forEach(async (data: any) => {
				await prisma.t_gacha_schedule_config.create({
					data: {
						gacha_type: data.gachaType,
						begin_time: begin,
						end_time: end,
						cost_item_id: data.costItemId,
						cost_item_num: 1,
						gacha_pool_id: 201,
						gacha_prob_rule_id: data.comment.substring(6).length == 0 ? 2 : 1,
						gacha_up_config: `{"gacha_up_list":[{"item_parent_type":1,"prob":${
							data.comment.substring(6).length == 0 ? '750' : '500'
						},"item_list":[${data.rateUpItems5.toString()}]},{"item_parent_type":2,"prob":500,"item_list":[${data.rateUpItems4.toString()}]}]}`,
						gacha_rule_config: '{}',
						gacha_prefab_path: data.prefabPath,
						gacha_preview_prefab_path: `UI_Tab_${data.prefabPath}`,
						gacha_prob_url: data.gacha_prob_url,
						gacha_record_url: '',
						gacha_prob_url_oversea: '',
						gacha_record_url_oversea: '',
						gacha_sort_id: data.comment.substring(6).length == 0 ? 3 : 982,
						enabled: parseInt(enable),
						title_textmap: data.comment.substring(6).length == 0 ? 'UI_GACHA_SHOW_PANEL_A020_TITLE' : data.titlePath,
						display_up4_item_list: data.rateUpItems4.toString(),
					},
				});
			});
			await interaction.reply({
				content: 'Sự kiện đã được thêm vào Server!',
			});
		} catch (error) {
			await interaction.reply({
				content: `Có lỗi xảy ra! Chi tiết: ${error.message}`,
			});
		}
	},
};

export default command;
