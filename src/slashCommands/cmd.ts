import {SlashCommandBuilder, PermissionFlagsBits, CommandInteraction} from 'discord.js';
import {SlashCommand} from '../types';
import cmd from '../data/cmd';

const command: SlashCommand = {
	command: new SlashCommandBuilder()
		.setName('cmd')
		.setDescription('Gửi lệnh GM.')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption((option) => option.setName('type').setDescription('Loại GM').setRequired(true).setAutocomplete(true)),
	cooldown: 1,
	autocomplete: async (interaction) => {
		try {
            const focusedOption = interaction.options.getFocused(true);
            const filtered: {value: string; name: string;}[] = cmd.filter((choice: any) =>
                choice.name.toLowerCase().includes(focusedOption.value.toLowerCase())
            );
            const options = filtered.length > 25 ? filtered.slice(0, 25) : filtered;
            await interaction.respond(options);
        } catch (error) {
            console.log(`Error in Autocomplete cmd: ${error.message}`);
        }
	},
	execute: async (interaction: CommandInteraction) => {
        if (!interaction.isChatInputCommand()) return;
		if (!interaction.guild) return interaction.reply('Không thể thực hiện ở DM');
        const type = interaction.options.getString('type', true);
        const selected = cmd.find((c) => c.value === type);
    },
};

export default command;
