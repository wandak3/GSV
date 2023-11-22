import {SlashCommandBuilder, PermissionFlagsBits, CommandInteraction} from 'discord.js';
import {SlashCommand} from '../types';
import {item} from '../data/item';
import {getGuildOption} from '../function';
import fetch from 'node-fetch';

const command: SlashCommand = {
	command: new SlashCommandBuilder()
		.setName('item')
		.setDescription('Gửi lệnh GM thêm item cho người chơi.')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('add')
				.setDescription('Gửi lệnh thêm item cho người chơi.')
				.addStringOption((option) => option.setName('uid').setDescription('UID của người chơi').setRequired(true))
				.addStringOption((option) =>
					option.setName('id').setDescription('Id của item').setRequired(true).setAutocomplete(true)
				)
				.addNumberOption((option) => option.setName('amount').setDescription('Số lượng'))
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('clear')
				.setDescription('Gửi lệnh xóa item của người chơi.')
				.addStringOption((option) => option.setName('uid').setDescription('UID của người chơi').setRequired(true))
				.addStringOption((option) =>
					option.setName('id').setDescription('Id của item').setRequired(true).setAutocomplete(true)
				)
				.addNumberOption((option) => option.setName('amount').setDescription('Số lượng'))
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('all')
				.setDescription('Thêm tất cả item + nhân vật ở level 1')
				.addStringOption((option) =>
					option.setName('name').setDescription('Tên sự kiện').setRequired(true).setAutocomplete(true)
				)
		),
	cooldown: 1,
	autocomplete: async (interaction) => {
		if (interaction.options.getSubcommand() === 'add') {
			/************************
			 * Autocomplete Item *
			 ************************/
			try {
				const focusedOption = interaction.options.getFocused(true);
				const filtered: {value: string; name: string}[] = item.filter((choice) =>
					choice.name.toLowerCase().includes(focusedOption.value.toLowerCase())
				);
				const options = filtered.length > 25 ? filtered.slice(0, 25) : filtered;
				await interaction.respond(options);
			} catch (error) {
				console.log(`Error in Autocomplete item: ${error.message}`);
			}
		} else if (interaction.options.getSubcommand() === 'clear') {
			/************************
			 * Autocomplete Item *
			 ************************/
			try {
				const focusedOption = interaction.options.getFocused(true);
				const filtered: {value: string; name: string}[] = item.filter((choice) =>
					choice.name.toLowerCase().includes(focusedOption.value.toLowerCase())
				);
				const options = filtered.length > 25 ? filtered.slice(0, 25) : filtered;
				await interaction.respond(options);
			} catch (error) {
				console.log(`Error in Autocomplete item: ${error.message}`);
			}
		}
	},
	execute: async (interaction: CommandInteraction) => {
		if (!interaction.isChatInputCommand()) return;
		if (!interaction.guild) return interaction.reply('Không thể thực hiện ở DM');
		const ip = await getGuildOption(interaction.guild, 'address');
		if (interaction.options.getSubcommand() === 'add') {
			/***************
			 * GM item add *
			 ***************/
			/* Lấy input từ bot */
			const id = interaction.options.getString('id', true);
			const uid = interaction.options.getString('uid', true);
			const amount = interaction.options.getNumber('amount') ?? 1;
			if (!interaction.guild) return interaction.reply('Không thể thực hiện ở DM');
			const itemId = item.find((e) => e.value === id) ?? item.find((e) => e.value === id);
			if (!itemId)
				return await interaction.reply({
					content: `Không tìm thấy item ${id} trong database. Vui lòng kiểm tra lại.`,
					ephemeral: true,
				});
			try {
				await fetch(
					`http://${ip}:10106/api?region=dev_docker&ticket=GM&cmd=1116&uid=${uid}&msg=item%20add%20${itemId.value}%20${amount}`
				);
				await interaction.reply({
					content: `Đã thêm item ${itemId.name} cho người chơi ${uid}`,
					ephemeral: true,
				});
			} catch (error) {
				console.log(`Error in GM item: ${error.message}\nIP: ${ip}`);
			}
		} else if (interaction.options.getSubcommand() === 'clear') {
			/******************
			 * GM item delete *
			 ******************/
			/* Lấy input từ bot */
			const id = interaction.options.getString('id', true);
			const uid = interaction.options.getString('uid', true);
			const amount = interaction.options.getNumber('amount') ?? 1;
			if (!interaction.guild) return interaction.reply('Không thể thực hiện ở DM');
			const itemId = item.find((e) => e.value === id) ?? item.find((e) => e.value === id);
			if (!itemId)
				return await interaction.reply({
					content: `Không tìm thấy item ${id} trong database. Vui lòng kiểm tra lại.`,
					ephemeral: true,
				});
			try {
				await fetch(
					`http://${ip}:10106/api?region=dev_docker&ticket=GM&cmd=1116&uid=${uid}&msg=item%20clear%20${itemId.value}%20${amount}`
				);
				await interaction.reply({
					content: `Đã xóa item ${itemId.name} khỏi người chơi ${uid}`,
					ephemeral: true,
				});
			} catch (error) {
				console.log(`Error in GM item: ${error.message}\nIP: ${ip}`);
			}
		}
	},
};

export default command;
