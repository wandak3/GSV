import {SlashCommandBuilder, PermissionFlagsBits, CommandInteraction} from 'discord.js';
import {SlashCommand} from '../types';
import {eventChoices} from '../data/events';
import {deleteEventScheduleConfig, getEventScheduleConfig, getUserOption} from '../function';

const command: SlashCommand = {
	command: new SlashCommandBuilder()
		.setName('remove')
		.setDescription('Xoá khỏi server')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		/************************
		 * Sự kiện *
		 ************************/
		.addSubcommand((subcommand) =>
			subcommand
				.setName('event')
				.setDescription('Xoá event khỏi server')
				.addStringOption((option) =>
					option.setName('name').setDescription('Tên event').setRequired(true).setAutocomplete(true)
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
				const url = await getUserOption(interaction.user, 'link');
				const returnValue = await getEventScheduleConfig(url);
				if (!returnValue) return;
				const event = eventChoices.filter((e) => {
					const findResult = returnValue.find((v: any) => parseInt(e.value) === v.schedule_id);
					return findResult;
				});
				const filtered: {name: string; value: string}[] = event.filter((choice: any) =>
					choice.name.includes(focusedOption.value)
				);
				const options = filtered.length > 25 ? filtered.slice(0, 25) : filtered;
				await interaction.respond(options);
			} catch (error) {
				console.log(`Error: ${error.message}`);
			}
		}
	},
	execute: async (interaction: CommandInteraction) => {
		if (!interaction.isChatInputCommand()) return;
		if (interaction.options.getSubcommand() === 'event') {
			/*************************
			 * Xoá sự kiện khỏi server *
			 *************************/
			const event = interaction.options.getString('name', true);
			const eventValue = eventChoices.find((e) => e.name === event) ?? eventChoices.find((e) => e.value === event);
			const url = await getUserOption(interaction.user, 'link');
			await deleteEventScheduleConfig(url, parseInt(eventValue!.value));
			await interaction.reply({
				content: 'Xoá thành công sự kiện khỏi server.',
			});
		}
	},
};

export default command;
