import {Interaction} from 'discord.js';
import {BotEvent} from '../types';
import {getGuildOption} from '../function';
import {randomUUID} from 'crypto';
import moment from 'moment';

const event: BotEvent = {
	name: 'interactionCreate',
	execute: async (interaction: Interaction) => {
		if (!interaction.isModalSubmit()) return;
		if (!interaction.guild) return interaction.reply('Không thể thực hiện ở DM');
		const ip = await getGuildOption(interaction.guild, 'address');
		if (interaction.customId === 'mailForm') {
			const receiver = interaction.fields.getTextInputValue('receiverInput').replace(/\s/g, '');
			const expiry = interaction.fields.getTextInputValue('expiryInput');
			const title = interaction.fields.getTextInputValue('titleInput');
			const description = interaction.fields.getTextInputValue('descriptionInput');
			const item = interaction.fields.getTextInputValue('itemInput').replace(/\s/g, '');
			// Xử lý tên
			const nameArray = receiver.split(':');
			const name = nameArray.map((item) => {
				const [uid, sender] = item.split(':');
				return {uid, sender};
			})[0];
			// Ngày sang giây
			const seconds = moment().add(Number(expiry), 'days').unix();
			console.log(nameArray);
			try {
				const uuid = randomUUID().replace(/-/gi, '');
				const res = await fetch(
					`http://${ip}:10106/api?sender=${name.sender}&title=${title}&content=${description}&item_list=${item}&expire_time=${seconds}&is_collectible=False&uid=${name.uid}&cmd=1005&region=dev_docker&ticket=GM%40${seconds}&sign=${uuid}`
				);
				const json = await res.json();
				console.log(json);
				await interaction.reply({content: 'Gửi thư thành công', ephemeral: true});
			} catch (error) {
				console.log(error);
				await interaction.reply({content: 'Có lỗi xảy ra khi gửi thư', ephemeral: true});
			}
		}
	},
};

export default event;
