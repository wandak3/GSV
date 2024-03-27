import { getPlayerOnline } from '../function';
import {BotEvent} from '../types';
import {ActivityType, Client} from 'discord.js';

const event: BotEvent = {
	name: 'ready',
	once: true,
	execute: async (client: Client) => {
		console.table({
			users: client.user?.tag,
			online: await getPlayerOnline(),
		});
		setInterval(async () => {
			const onlinePlayer = await getPlayerOnline();
			if (onlinePlayer === "down") {
				client.user?.setActivity(`Bảo trì.`, {
					type: ActivityType.Listening,
				});
			} else {
				client.user?.setActivity(` với ${onlinePlayer} người.`, {
					type: ActivityType.Playing,
				});
			}
			
		}, 60_000);
	},
};

export default event;
