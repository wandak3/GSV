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
				const res = await fetch(`http://35.215.146.105:10106/api?cmd=1101&region=dev_docker&ticket=GM`);
				const json = await res.json();
				if (json.msg === 'succ') {
					client.user?.setActivity(`with ${json.data.internal_data} players.`, {
						type: ActivityType.Playing,
					});
				} else {
					console.log(json);
				}
				setTimeout(getPlayerOnline, 30000);
			} catch (error) {
				console.log(error.message);
			}
		})();
	},
};

export default event;
