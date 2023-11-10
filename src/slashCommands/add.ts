import {
	SlashCommandBuilder,
	PermissionFlagsBits,
	CommandInteraction,
	EmbedBuilder,
	ButtonBuilder,
	ButtonStyle,
	ActionRowBuilder,
} from 'discord.js';
import {GachaTypeGuard, SlashCommand} from '../types';
import {eventChoices} from '../data/events';
import {characterChoices} from '../data/character';
import {weaponChoices} from '../data/weapon';
import {
	getGachadata,
	getUserOption,
	setUserOption,
	updateEventScheduleConfig,
	updateGachaScheduleConfig,
} from '../function';
import moment, {DurationInputArg1, DurationInputArg2} from 'moment';

const command: SlashCommand = {
	command: new SlashCommandBuilder()
		.setName('add')
		.setDescription('Thêm vào server')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		/************************
		 * Sự kiện *
		 ************************/
		.addSubcommand((subcommand) =>
			subcommand
				.setName('event')
				.setDescription('Thêm event vào server')
				.addStringOption((option) =>
					option.setName('name').setDescription('Tên event').setRequired(true).setAutocomplete(true)
				)
				.addStringOption((option) =>
					option.setName('start').setDescription('Đặt thời gian bắt đầu cho sự kiện. Mặc định là hôm nay.')
				)
				.addStringOption((option) =>
					option
						.setName('end')
						.setDescription('Đặt thời gian kéo dài cho sự kiện (1d, 2w, 3m, 4y). Mặc định là 2 tuần (2w)')
				)
		)
		/************************
		 * Nhân vật *
		 ************************/
		.addSubcommand((subcommand) =>
			subcommand
				.setName('character')
				.setDescription('Thêm sự kiện cầu nguyện vào server')
				.addStringOption((option) =>
					option.setName('5star').setDescription('Tên nhân vật 5 sao').setRequired(true).setAutocomplete(true)
				)
				.addNumberOption((option) =>
					option
						.setName('gtype')
						.setDescription('Các gacha type cho nhân vật. Lưu ý: không được trùng nhau.')
						.setRequired(true)
						.addChoices({name: '301', value: 301}, {name: '400', value: 400})
				)
				.addStringOption((option) =>
					option.setName('start').setDescription('Đặt thời gian bắt đầu cho sự kiện. Mặc định là hôm nay.')
				)
				.addStringOption((option) =>
					option
						.setName('end')
						.setDescription('Đặt thời gian kéo dài cho sự kiện (1d, 2w, 3m, 4y). Mặc định là 2 tuần (2w)')
				)
		)
		/************************
		 * Vũ khí *
		 ************************/
		.addSubcommand((subcommand) =>
			subcommand
				.setName('weapon')
				.setDescription('Thêm vũ khí vào sự kiện cầu nguyện vào server')
				.addStringOption((option) =>
					option.setName('weap1').setDescription('Tên vũ khí').setRequired(true).setAutocomplete(true)
				)
				.addStringOption((option) =>
					option.setName('weap2').setDescription('Tên vũ khí').setRequired(true).setAutocomplete(true)
				)
				.addStringOption((option) =>
					option.setName('start').setDescription('Đặt thời gian bắt đầu cho sự kiện. Mặc định là hôm nay.')
				)
				.addStringOption((option) =>
					option
						.setName('end')
						.setDescription('Đặt thời gian kéo dài cho sự kiện (1d, 2w, 3m, 4y). Mặc định là 2 tuần (2w)')
				)
		),
	cooldown: 1,
	autocomplete: async (interaction) => {
		if (interaction.options.getSubcommand() === 'event') {
			/************************
			 * Autocomplete sự kiện *
			 ************************/
			try {
				const focusedOption = interaction.options.getFocused(true);
				const filtered: {value: string; name: string}[] = eventChoices.filter((choice) =>
					choice.name.toLowerCase().includes(focusedOption.value.toLowerCase())
				);
				const options = filtered.length > 25 ? filtered.slice(0, 25) : filtered;
				await interaction.respond(options);
			} catch (error) {
				console.log(`Error in Autocomplete sự kiện: ${error.message}`);
			}
		} else if (interaction.options.getSubcommand() === 'character') {
			/*************************
			 * Autocomplete nhân vật *
			 *************************/
			try {
				const focusedOption = interaction.options.getFocused(true);
				const filtered: {value: string; name: string; remark?: string}[] = characterChoices.filter((choice) => {
					if (focusedOption.name === '5star')
						return choice.name.toLowerCase().includes(focusedOption.value.toLowerCase()) && choice.remark === '5';
					return choice.name.toLowerCase().includes(focusedOption.value.toLowerCase()) && choice.remark === '4';
				});
				const options = filtered.length > 25 ? filtered.slice(0, 25) : filtered;
				await interaction.respond(options);
			} catch (error) {
				console.log(`Error in Autocomplete nhân vật: ${error.message}`);
			}
		} else if (interaction.options.getSubcommand() === 'weapon') {
			/*************************
			 * Autocomplete vũ khí *
			 *************************/
			try {
				const focusedOption = interaction.options.getFocused(true);
				const filtered: {value: string; name: string}[] = weaponChoices.filter((choice) => {
					return choice.name.toLowerCase().includes(focusedOption.value.toLowerCase());
				});
				const options = filtered.length > 25 ? filtered.slice(0, 25) : filtered;
				await interaction.respond(options);
			} catch (error) {
				console.log(`Error in Autocomplete vũ khí: ${error.message}`);
			}
		}
	},
	execute: async (interaction: CommandInteraction, client) => {
		if (!interaction.isChatInputCommand()) return;
		if (interaction.options.getSubcommand() === 'event') {
			/*************************
			 * Thêm sự kiện vào server *
			 *************************/
			/* Lấy input từ bot */
			const event = interaction.options.getString('name', true);
			const startDate = interaction.options.getString('start') ?? new Date();
			const endTime = interaction.options.getString('end') ?? '';
			/* Tìm sự kiện trong databse */
			const eventValue = eventChoices.find((e) => e.name === event) ?? eventChoices.find((e) => e.value === event);
			/* Tách thời gian trong string */
			let letters = endTime.match(/[a-zA-Z]/g) ?? ['w'];
			let digits = endTime.match(/[0-9]/g) ?? ['2'];
			const endDate = moment(startDate, 'DD-MM-YYYY hh:mm:ss', 'Asia/Ho_Chi_Minh')
				.add(digits[0] as DurationInputArg1, letters[0].toUpperCase() as DurationInputArg2)
				.toDate();
			/* Bot phản hồi */
			const url = await getUserOption(interaction.user, 'link');
			if (!url) {
				await interaction.reply({
					content: 'Database không tồn tại. Vui lòng thử lại sau.',
				});
				return;
			}
			const result = await updateEventScheduleConfig(url, eventValue!.value, moment(startDate).toDate(), endDate);
			if (!result) {
				await interaction.reply({
					content: `Thêm thành công sự kiện **${eventValue!.name}** vào server.`,
				});
			} else {
				if (result.includes('Unique constraint'))
					await interaction.reply({
						content: 'Sự kiện đã tồn tại trong database. Vui lòng thử sự kiện khác.',
					});
				else {
					await interaction.reply({
						content: 'Đã có lỗi xảy ra. Vui lòng thử lại sau.',
					});
				}
			}
		} else if (interaction.options.getSubcommand() === 'character') {
			/*************************
			 * Thêm nhân vật vào server *
			 *************************/
			/* Lấy input từ bot */
			const fiveStar = interaction.options.getString('5star', true);
			const gtype = interaction.options.getNumber('gtype', true);
			const startDate = interaction.options.getString('start') ?? moment().toDate();
			const endTime = interaction.options.getString('end') ?? '';
			/* Tách thời gian trong string */
			let letters = endTime.match(/[a-zA-Z]/g) ?? ['w'];
			let digits = endTime.match(/[0-9]/g) ?? ['2'];
			/* Thời gian kết thúc sự kiện */
			const endDate = moment(startDate, 'DD-MM-YYYY hh:mm:ss', 'Asia/Ho_Chi_Minh')
				.startOf('day')
				.add(digits[0] as DurationInputArg1, letters[0].toUpperCase() as DurationInputArg2)
				.toDate();
			/* Tránh overlap gachaType */
			const gachaGuard = await getUserOption(interaction.user, 'schedule');
			if (gachaGuard.length) {
				const gachaTypeGuardFilter = gachaGuard.find(
					(e: {gachaType: number; date: Date}) =>
						e.gachaType === gtype &&
						moment(startDate, 'DD-MM-YYYY hh:mm:ss', 'Asia/Ho_Chi_Minh').diff(e.date, 'minutes') < 1
				);
				if (gachaTypeGuardFilter) {
					await interaction.reply({
						content: `Đã tồn tại gacha type ${gtype}, hoạt động đến ${moment(
							gachaTypeGuardFilter.date,
							'DD-MM-YYYY hh:mm:ss',
							'Asia/Ho_Chi_Minh'
						).format('DD/MM/YYYY HH:mm:ss')} trong server.`,
					});
					return;
				}
			}
			/* Tìm nhân vật trong database */
			const fiveStarValue =
				characterChoices.find((e) => e.name === fiveStar) ?? characterChoices.find((e) => e.value === fiveStar);
			/* Tìm nhân vật trong database */
			const gacha = getGachadata(fiveStarValue!.value);
			/* Xây dựng embed */
			const embed = new EmbedBuilder()
				.setAuthor({
					name: gacha[0].name,
				})
				.setColor('#404eed')
				.setThumbnail(`https://genshindb.org/wp-content/uploads/2022/10/${gacha[0].name.replace(' ', '-')}.webp`)
				.setTitle(
					`Chọn phiên bản của sự kiện\nBắt đầu từ ${moment(startDate, 'DD-MM-YYYY hh:mm:ss', 'Asia/Ho_Chi_Minh').format(
						'DD/MM/YYYY'
					)} - ${moment(endDate, 'DD-MM-YYYY hh:mm:ss', 'Asia/Ho_Chi_Minh').format('DD/MM/YYYY')}`
				)
				.setTimestamp()
				.setFooter({
					text: 'GM Helper Bot',
					iconURL: 'https://ik.imagekit.io/asiatarget/genshin/icon_128x128.png?updatedAt=1699385494260',
				});
			let row = new ActionRowBuilder<ButtonBuilder>();
			/* Tổng hợp thông tin từ database */
			gacha.map((data, index) => {
				const rateUpItems = data.rateUpItems4.map((item) => {
					return characterChoices.find((choice) => choice.value === item.toString())?.name;
				});
				embed.addFields({
					name: `Phiên bản ${index + 1}`,
					value: `
          **Thứ tự:** ${data.scheduleId}
          **Tướng 4 sao:** tướng 4 sao có trong banner\n
		  1. ${rateUpItems[0]}\n2. ${rateUpItems[1]}\n3. ${rateUpItems[2]}
          `,
					inline: true,
				});
				const button = new ButtonBuilder()
					.setCustomId(`${data.scheduleId}`)
					.setLabel(`Phiên bản ${index + 1}`)
					.setStyle(ButtonStyle.Primary);
				row.addComponents(button);
			});
			/* Bot phản hồi */
			try {
				const response = await interaction.reply({
					embeds: [embed],
					components: [row],
				});
				const collectorFilter = (i: any) => i.user.id === interaction.user.id;
				const collector = response.createMessageComponentCollector({
					filter: collectorFilter,
					time: 60000,
				});
				const url = await getUserOption(interaction.user, 'link');
				if (!url) {
					await interaction.reply({
						content: 'Database không tồn tại. Vui lòng thử lại sau.',
					});
					return;
				}
				collector.on('collect', async (i) => {
					const update = await updateGachaScheduleConfig({
						url: await getUserOption(interaction.user, 'link'),
						gachaPropRuleId: 1,
						scheduleId: parseInt(i.customId),
						gachaType: gtype,
						start: moment(startDate, 'DD-MM-YYYY hh:mm:ss', 'Asia/Ho_Chi_Minh').toDate(),
						end: endDate,
					});
					if (!update) {
						await i.update({
							content: `Thêm thành công Sự kiện ước nguyện vào server.`,
							embeds: [],
							components: [],
						});
						/* Thêm gacha type và database để guard */
						await setUserOption(interaction.user, 'schedule', {gachaType: gtype, date: endDate});
					} else {
						await i.update({
							content: `Có lỗi xảy ra khi thêm Sự kiện ước nguyện vào server.`,
							embeds: [],
							components: [],
						});
					}
				});
			} catch (error) {
				if (error.message === 'Invalid Form Body') {
					await interaction.reply({
						content: 'Có lỗi về form body. Vui lòng thử lại sau.',
					});
				} else {
					await interaction.reply({
						content: 'Có lỗi bất thường xảy ra. Mô tả lỗi: ' + error.message,
					});
				}
			}
		} else if (interaction.options.getSubcommand() === 'weapon') {
			/*************************
			 * Thêm vũ khí vào server *
			 *************************/
			/* Lấy input từ bot */
			const weap1 = interaction.options.getString('weap1', true);
			const weap2 = interaction.options.getString('weap2', true);
			const startDate = interaction.options.getString('start') ?? moment().toDate();
			const endTime = interaction.options.getString('end') ?? '';
			/* Tìm vũ khí trong database */
			const weapon = weaponChoices.find((e) => e.value === weap1) ?? weaponChoices.find((e) => e.name === weap1);
			/* Tách thời gian trong string */
			let letters = endTime.match(/[a-zA-Z]/g) ?? ['w'];
			let digits = endTime.match(/[0-9]/g) ?? ['2'];
			/* Thời gian kết thúc sự kiện */
			const endDate = moment(startDate, 'DD-MM-YYYY hh:mm:ss', 'Asia/Ho_Chi_Minh')
				.startOf('day')
				.add(digits[0] as DurationInputArg1, letters[0].toUpperCase() as DurationInputArg2)
				.toDate();
			/* Tìm thông tin gacha từ database */
			const gacha = getGachadata(weapon!.value);
			const url = await getUserOption(interaction.user, 'link');
			if (!url) {
				await interaction.reply({
					content: `Bạn chưa đăng ký URL database.`,
				});
				return;
			}
			const update = await updateGachaScheduleConfig({
				url: await getUserOption(interaction.user, 'link'),
				gachaPropRuleId: 2,
				scheduleId: gacha[0].scheduleId,
				gachaType: 302,
				start: moment(startDate, 'DD-MM-YYYY hh:mm:ss', 'Asia/Ho_Chi_Minh').toDate(),
				end: endDate,
				weapon: `${weap1},${weap2}`,
			});
			if (!update) {
				await interaction.reply({
					content: `Thêm thành công Sự kiện ước nguyện vũ khí vào server.`,
				});
			} else {
				await interaction.reply({
					content: `Có lỗi xảy ra khi thêm Sự kiện ước nguyện vũ khí vào server.`,
				});
			}
		}
	},
};

export default command;
