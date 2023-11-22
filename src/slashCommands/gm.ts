import {SlashCommandBuilder, PermissionFlagsBits, CommandInteraction} from 'discord.js';
import {SlashCommand} from '../types';
import {item} from '../data/item';

const command: SlashCommand = {
	command: new SlashCommandBuilder()
		.setName('gm')
		.setDescription('Gửi lệnh GM')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('item')
				.setDescription('Gửi lệnh thêm item cho người chơi.')
				.addStringOption((option) => option.setName('uid').setDescription('UID của người chơi').setRequired(true))
				.addStringOption((option) =>
					option.setName('id').setDescription('Id của item').setRequired(true).setAutocomplete(true)
				)
				.addNumberOption((option) => option.setName('ammount').setDescription('Số lượng'))
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('weapon')
				.setDescription('Gửi lệnh thêm vũ khí cho người chơi.')
				.addStringOption((option) =>
					option.setName('name').setDescription('Tên sự kiện').setRequired(true).setAutocomplete(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('mail')
				.setDescription('Gửi thư người chơi.')
				.addStringOption((option) =>
					option.setName('name').setDescription('Tên sự kiện').setRequired(true).setAutocomplete(true)
				)
		),
	cooldown: 1,
	autocomplete: async (interaction) => {
		if (interaction.options.getSubcommand() === 'item') {
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
		if (interaction.options.getSubcommand() === 'item') {
			/*********
			 * GM item *
			 *********/
			/* Lấy input từ bot */
			const id = interaction.options.getString('id', true);
			const uid = interaction.options.getString('uid', true);
			const ammount = interaction.options.getString('ammount') ?? 1;
			try {
				await fetch(
					`${id}:10106/api?region=dev_docker&ticket=GM&cmd=1116&uid=${uid}&msg=item%20add%20${id}%20${ammount}`
				);
			} catch (error) {
				console.log(`Error in GM item: ${error.message}`);
			}
		}
	},
};

export default command;
