import {BotEvent} from '../types';
import {ActivityType, Client} from 'discord.js';

const event: BotEvent = {
	name: 'ready',
	once: true,
	execute: (client: Client): void => {
		console.table({
			users: client.user?.tag,
			guilds: client.guilds.cache.size,
			members: client.guilds.cache
				.map((c: any) => c.memberCount)
				.filter((v: any) => typeof v === 'number')
				.reduce((a: any, b: any) => a + b, 0),
		});
		(async function getPlayerOnline() {
			try {
				const ip = process.env.IP;
				const res = await fetch(`http://${ip}:14861/api?cmd=1101&region=dev_gio&ticket=GM`);
				const json = await res.json();
				if (json.msg === 'succ') {
					client.user?.setActivity(`with ${json.data.online_player_num_except_sub_account} players.`, {
						type: ActivityType.Playing,
					});
				}
				setTimeout(getPlayerOnline, 10000);
			} catch (error) {
				console.log(error.message);
			}
		})();
	},
};

export default event;
