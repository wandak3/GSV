import {SlashCommandBuilder, EmbedBuilder, CommandInteraction} from 'discord.js';
import {SlashCommand} from '../types';
import {getPlayerData, pagination} from '../function';
import moment from 'moment';

const command: SlashCommand = {
	command: new SlashCommandBuilder()
		.setName('get')
		.setDescription('Lấy thông tin nhân vật.')
		.addStringOption((option) => option.setName('uid').setDescription('UID của người chơi').setRequired(true))
		.addStringOption((option) => option.setName('char').setDescription('Nhân vật').setRequired(true)),
	cooldown: 2,
	execute: async (interaction: CommandInteraction) => {
		if (!interaction.isChatInputCommand()) return;
		if (!interaction.guild) return interaction.reply('Không thể thực hiện ở DM');
		const uid = interaction.options.getString('uid', true);
		const char = interaction.options.getString('char', true);
		const playerData = await getPlayerData(uid, char);
	},
};

export default command;
