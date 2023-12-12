import {SlashCommandBuilder, EmbedBuilder} from 'discord.js';
import {SlashCommand} from '../types';
import {getPlayerData, pagination} from '../function';
import moment from 'moment';

const command: SlashCommand = {
	command: new SlashCommandBuilder().setName('rank').setDescription('Bảng xếp hạng level.'),
	cooldown: 2,
	execute: async (interaction) => {
		try {
			if (!interaction.isCommand()) return;
			const playerData = await getPlayerData();
			const filteredData = playerData.filter((player: any) => player.uid !== 1 && player.uid !== 52);
			const chunkSize = 5;
			let embeds: EmbedBuilder[] = [];
			for (let i = 0; i < filteredData.length; i += chunkSize) {
				const chunk = filteredData.slice(i, i + chunkSize);
				const embed = new EmbedBuilder()
					.setThumbnail(
						'https://ik.imagekit.io/asiatarget/genshin/official-2022-birthday-artwork-paimon-v0-mq0q0yr8px291.jpg?updatedAt=1702415543178'
					)
					.setTitle('Bảng xếp hạng AR Server Wumpus')
					.setColor('#404eed')
					.setTimestamp()
					.setFooter({
						text: 'GM Helper Bot',
						iconURL: 'https://ik.imagekit.io/asiatarget/genshin/icon_128x128.png?updatedAt=1699385494260',
					});
				chunk.forEach((player: any, index: number) => {
					embed.addFields({
						name: `${i + index + 1}. ${player.nickname} (AR ${player.level})`,
						value: `UID: ${player.uid}\nNgày tham gia: ${moment(player.create_time).format('DD/MM/YYYY')}`,
					});
				});
				embeds.push(embed);
			}
			await pagination(interaction, embeds, 45000);
		} catch (error) {
			console.log(`Error in Get Player Data: ${error}`);
		}
	},
};

export default command;
