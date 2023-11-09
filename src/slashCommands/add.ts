import {
	SlashCommandBuilder,
	PermissionFlagsBits,
	CommandInteraction,
	EmbedBuilder,
	ButtonBuilder,
	ButtonStyle,
	ActionRowBuilder,
} from "discord.js";
import { SlashCommand } from "../types";
import { eventChoices } from "../data/events";
import { characterChoices } from "../data/character";
import { weaponChoices } from "../data/weapon";
import {
	findGachaData,
	getUserOption,
	updateEventScheduleConfig,
	updateGachaScheduleConfig,
} from "../function";
import moment, { DurationInputArg1, DurationInputArg2 } from "moment";

const command: SlashCommand = {
	command: new SlashCommandBuilder()
		.setName("add")
		.setDescription("Thêm vào server")
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		/************************
		 * Sự kiện *
		 ************************/
		.addSubcommand((subcommand) =>
			subcommand
				.setName("event")
				.setDescription("Thêm event vào server")
				.addStringOption((option) =>
					option
						.setName("name")
						.setDescription("Tên event")
						.setRequired(true)
						.setAutocomplete(true)
				)
				.addStringOption((option) =>
					option
						.setName("start")
						.setDescription(
							"Đặt thời gian bắt đầu cho sự kiện. Mặc định là hôm nay."
						)
				)
				.addStringOption((option) =>
					option
						.setName("end")
						.setDescription(
							"Đặt thời gian kéo dài cho sự kiện (1d, 2w, 3m, 4y). Mặc định là 2 tuần (2w)"
						)
				)
		)
		/************************
		 * Nhân vật *
		 ************************/
		.addSubcommand((subcommand) =>
			subcommand
				.setName("character")
				.setDescription("Thêm sự kiện cầu nguyện vào server")
				.addStringOption((option) =>
					option
						.setName("5star")
						.setDescription("Tên nhân vật 5 sao")
						.setRequired(true)
						.setAutocomplete(true)
				)
				.addNumberOption((option) =>
					option
						.setName("gtype")
						.setDescription(
							"Các gacha type cho nhân vật. Lưu ý: không được trùng nhau."
						)
						.setRequired(true)
						.addChoices(
							{ name: "301", value: 301 },
							{ name: "400", value: 400 }
						)
				)
				.addStringOption((option) =>
					option
						.setName("start")
						.setDescription(
							"Đặt thời gian bắt đầu cho sự kiện. Mặc định là hôm nay."
						)
				)
				.addStringOption((option) =>
					option
						.setName("end")
						.setDescription(
							"Đặt thời gian kéo dài cho sự kiện (1d, 2w, 3m, 4y). Mặc định là 2 tuần (2w)"
						)
				)
		)
		/************************
		 * Vũ khí *
		 ************************/
		.addSubcommand((subcommand) =>
			subcommand
				.setName("weapon")
				.setDescription("Thêm vũ khí vào sự kiện cầu nguyện vào server")
				.addStringOption((option) =>
					option
						.setName("weap1")
						.setDescription("Tên vũ khí")
						.setRequired(true)
						.setAutocomplete(true)
				)
				.addStringOption((option) =>
					option
						.setName("weap2")
						.setDescription("Tên vũ khí")
						.setRequired(true)
						.setAutocomplete(true)
				)
				.addNumberOption((option) =>
					option
						.setName("gtype")
						.setDescription(
							"Các gacha type cho nhân vật. Lưu ý: không được trùng nhau."
						)
						.setRequired(true)
						.addChoices(
							{ name: "301", value: 301 },
							{ name: "400", value: 400 }
						)
				)
				.addStringOption((option) =>
					option
						.setName("start")
						.setDescription(
							"Đặt thời gian bắt đầu cho sự kiện. Mặc định là hôm nay."
						)
				)
				.addStringOption((option) =>
					option
						.setName("end")
						.setDescription(
							"Đặt thời gian kéo dài cho sự kiện (1d, 2w, 3m, 4y). Mặc định là 2 tuần (2w)"
						)
				)
		),
	cooldown: 1,
	autocomplete: async (interaction) => {
		/************************
		 * Autocomplete sự kiện *
		 ************************/
		if (interaction.options.getSubcommand() === "event") {
			try {
				const focusedOption = interaction.options.getFocused(true);
				let filtered: { value: string; name: string }[] =
					eventChoices.filter((choice) =>
						choice.name.includes(focusedOption.value)
					);
				let options =
					filtered.length > 25 ? filtered.slice(0, 25) : filtered;
				await interaction.respond(options);
			} catch (error) {
				console.log(`Error: ${error.message}`);
			}
		} else if (interaction.options.getSubcommand() === "character") {
			/*************************
			 * Autocomplete nhân vật *
			 *************************/
			try {
				const focusedOption = interaction.options.getFocused(true);
				let filtered: { value: string; name: string; remark?: string }[] =
					characterChoices.filter((choice) => {
						if (focusedOption.name === "5star")
							return (
								choice.name.includes(focusedOption.value) &&
								choice.remark === "5"
							);
						return (
							choice.name.includes(focusedOption.value) &&
							choice.remark === "4"
						);
					});
				let options =
					filtered.length > 25 ? filtered.slice(0, 25) : filtered;
				await interaction.respond(options);
			} catch (error) {
				console.log(`Error: ${error.message}`);
			}
		} else if (interaction.options.getSubcommand() === "weapon") {
			try {
				const focusedOption = interaction.options.getFocused(true);
				let filtered: { value: string; name: string }[] =
					weaponChoices.filter((choice) => {
						return choice.name.includes(focusedOption.value);
					});
				let options =
					filtered.length > 25 ? filtered.slice(0, 25) : filtered;
				await interaction.respond(options);
			} catch (error) {
				console.log(`Error: ${error.message}`);
			}
		}
	},
	execute: async (interaction: CommandInteraction) => {
		if (!interaction.isChatInputCommand()) return;
		/*************************
		 * Thêm sự kiện vào server *
		 *************************/
		if (interaction.options.getSubcommand() === "event") {
			const event = interaction.options.getString("name", true);
			let eventValue =
				eventChoices.find((e) => e.name === event) ??
				eventChoices.find((e) => e.value === event);
			const startDate = interaction.options.getString("start") ?? new Date();
			const endTime = interaction.options.getString("end") ?? "";
			var letters = endTime.match(/[a-zA-Z]/g) ?? ["w"];
			var digits = endTime.match(/[0-9]/g) ?? ["2"];
			const endDate = moment(
				startDate,
				"DD-MM-YYYY hh:mm:ss",
				"Asia/Ho_Chi_Minh"
			)
				.add(
					digits[0] as DurationInputArg1,
					letters[0].toUpperCase() as DurationInputArg2
				)
				.toDate();
			await updateEventScheduleConfig(
				eventValue!.value,
				moment(startDate).toDate(),
				endDate
			);
			await interaction.reply({
				content: "Thêm thành công sự kiện vào server.",
			});
		} else if (interaction.options.getSubcommand() === "character") {
			/*************************
			 * Thêm nhân vật vào server *
			 *************************/
			const fiveStar = interaction.options.getString("5star", true);
			let fiveStarValue =
				characterChoices.find((e) => e.name === fiveStar) ??
				characterChoices.find((e) => e.value === fiveStar);
			const gtype = interaction.options.getNumber("gtype", true);
			const startDate =
				interaction.options.getString("start") ?? moment().toDate();
			const endTime = interaction.options.getString("end") ?? "";
			var letters = endTime.match(/[a-zA-Z]/g) ?? ["w"];
			var digits = endTime.match(/[0-9]/g) ?? ["2"];
			const endDate = moment(
				startDate,
				"DD-MM-YYYY hh:mm:ss",
				"Asia/Ho_Chi_Minh"
			)
				.startOf("day")
				.add(
					digits[0] as DurationInputArg1,
					letters[0].toUpperCase() as DurationInputArg2
				)
				.toDate();
			const gacha = findGachaData(fiveStarValue!.value);
			const embed = new EmbedBuilder()
				.setAuthor({
					name: gacha[0].name,
				})
				.setColor("#404eed")
				.setThumbnail(
					`https://genshindb.org/wp-content/uploads/2022/10/${gacha[0].name.replace(
						" ",
						"-"
					)}.webp`
				)
				.setTitle(
					`Chọn phiên bản của sự kiện\nBắt đầu từ ${moment(
						startDate,
						"DD-MM-YYYY hh:mm:ss",
						"Asia/Ho_Chi_Minh"
					).format("DD/MM/YYYY")} - ${moment(
						endDate,
						"DD-MM-YYYY hh:mm:ss",
						"Asia/Ho_Chi_Minh"
					).format("DD/MM/YYYY")}`
				)
				.setTimestamp()
				.setFooter({
					text: "GM Helper Bot",
					iconURL:
						"https://ik.imagekit.io/asiatarget/genshin/icon_128x128.png?updatedAt=1699385494260",
				});
			var row = new ActionRowBuilder<ButtonBuilder>();
			gacha.map((data, index) => {
				const rateUpItems = data.rateUpItems4.map((item) => {
					return characterChoices.find(
						(choice) => choice.value === item.toString()
					)?.name;
				});
				embed.addFields({
					name: `Phiên bản ${index + 1}`,
					value: `
          **Thứ tự:** ${data.scheduleId}
          **Tướng 4 sao:** tướng 4 sao có trong banner \n1. ${rateUpItems[0]}\n2. ${rateUpItems[1]}\n3. ${rateUpItems[2]}
          `,
					inline: true,
				});
				const button = new ButtonBuilder()
					.setCustomId(`${data.scheduleId}`)
					.setLabel(`Phiên bản ${index + 1}`)
					.setStyle(ButtonStyle.Primary);
				row.addComponents(button);
			});
			try {
				const response = await interaction.reply({
					embeds: [embed],
					components: [row],
				});
				const collectorFilter = (i: any) =>
					i.user.id === interaction.user.id;
				const collector = response.createMessageComponentCollector({
					filter: collectorFilter,
					time: 60000,
				});
				collector.on("collect", async (i) => {
					await updateGachaScheduleConfig({
						url: await getUserOption(interaction.user, "link"),
						gachaPropRuleId: 1,
						scheduleId: parseInt(i.customId),
						gachaType: gtype,
						start: moment(
							startDate,
							"DD-MM-YYYY hh:mm:ss",
							"Asia/Ho_Chi_Minh"
						).toDate(),
						end: endDate,
					});
					await i.update({
						content: `Thêm thành công Sự kiện ước nguyện vào server.`,
						embeds: [],
						components: [],
					});
				});
			} catch (error) {
				if (error.message === "Invalid Form Body") {
					await interaction.reply({
						content: "Có lỗi về form body. Vui lòng thử lại sau.",
					});
				} else {
					await interaction.reply({
						content:
							"Có lỗi bất thường xảy ra. Mô tả lỗi: " + error.message,
					});
				}
			}
		} else if (interaction.options.getSubcommand() === "weapon") {
			/*************************
			 * Thêm vũ khí vào server *
			 *************************/
			const weap1 = interaction.options.getString("weap1", true);
			const weap2 = interaction.options.getString("weap2", true);
			let weapon =
				weaponChoices.filter((e) => e.name === weap1 && e.name === weap2) ??
				weaponChoices.filter((e) => e.value === weap1);
			const gtype = interaction.options.getNumber("gtype", true);
			const startDate =
				interaction.options.getString("start") ?? moment().toDate();
			const endTime = interaction.options.getString("end") ?? "";
		}
	},
};

export default command;
