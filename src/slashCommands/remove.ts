import {SlashCommandBuilder, PermissionFlagsBits, CommandInteraction} from 'discord.js';
import {SlashCommand} from '../types';
import {eventChoices} from '../data/events';
import {
	deleteEventScheduleConfig,
	deleteGachaScheduleConfig,
	getEventScheduleConfig,
	getGachaScheduleConfig,
} from '../function';
import {schedule} from '../data/schedule';
import type {t_gacha_schedule_config, t_h5_activity_schedule_config} from '@prisma/client';
import type {Schedule} from '../data/schedule';

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
				.setDescription('Xoá sự kiện khỏi server')
				.addStringOption((option) =>
					option.setName('name').setDescription('Tên sự kiện').setRequired(true).setAutocomplete(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('gacha')
				.setDescription('Xoá sự kiện ước nguyện khỏi server')
				.addStringOption((option) =>
					option.setName('name').setDescription('Tên sự kiện').setRequired(true).setAutocomplete(true)
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
				const returnValue = await getEventScheduleConfig();
				if (!returnValue) return;
				const event = eventChoices.filter((e) => {
					const findResult = returnValue.find(
						(v: t_h5_activity_schedule_config) => parseInt(e.value) === v.schedule_id
					);
					return findResult;
				});
				const filtered: {name: string; value: string}[] = event.filter((choice: any) =>
					choice.name.includes(focusedOption.value)
				);
				const options = filtered.length > 25 ? filtered.slice(0, 25) : filtered;
				await interaction.respond(options);
			} catch (error) {
				console.log(`Error in Autocomplete sự kiện: ${error.message}`);
			}
		} else if (interaction.options.getSubcommand() === 'gacha') {
			/*********************************
			 * Autocomplete sự kiện ước nguyện *
			 *********************************/
			try {
				const focusedOption = interaction.options.getFocused(true);
				const returnValue = await getGachaScheduleConfig();
				if (!returnValue) return;
				const gacha = schedule.filter((e) => {
					const findResult = returnValue.find((v: t_gacha_schedule_config) => e.scheduleId === v.schedule_id);
					return findResult;
				});
				const filtered: {name: string; value: string}[] = gacha.filter((choice: Schedule) =>
					choice.value.includes(focusedOption.value)
				);
				const options = filtered.length > 25 ? filtered.slice(0, 25) : filtered;
				await interaction.respond(options);
			} catch (error) {
				console.log(`Error in Autocomplete sự kiện ước nguyện: ${error.message}`);
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
			if (!eventValue) {
				await interaction.reply({
					content: 'Sự kiện không tồn tại.',
				});
				return;
			}
			await deleteEventScheduleConfig(parseInt(eventValue!.value));
			try {
				await deleteEventScheduleConfig(parseInt(eventValue!.value));
				await interaction.reply({
					content: `Xoá thành công sự kiện ${eventValue!.name} khỏi server.`,
				});
			} catch (error) {
				await interaction.reply({
					content: 'Sự kiện không tồn tại hoặc có lỗi xảy ra.',
				});
			}
		} else if (interaction.options.getSubcommand() === 'gacha') {
			/*************************
			 * Xoá sự kiện khỏi server *
			 *************************/
			const gacha = interaction.options.getString('name', true);
			const gachaValue = schedule.find((e) => e.name === gacha) ?? schedule.find((e) => e.value === gacha);
			if (!gachaValue) {
				await interaction.reply({
					content: 'Sự kiện không tồn tại.',
				});
				return;
			}
			try {
				await deleteGachaScheduleConfig(gachaValue!.scheduleId);
				await interaction.reply({
					content: `Xoá thành công sự kiện ${gachaValue!.name} khỏi server.`,
				});
			} catch (error) {
				await interaction.reply({
					content: 'Sự kiện không tồn tại hoặc có lỗi xảy ra.',
				});
			}
		}
	},
};

export default command;
