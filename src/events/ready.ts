import moment from 'moment';
import {BotEvent} from '../types';
import {randomUUID} from 'crypto';
import {ActivityType} from 'discord.js';

const event: BotEvent = {
	name: 'ready',
	once: true,
	execute: async (client): Promise<void> => {
		console.table({
			users: client.user?.tag,
			guilds: client.guilds.cache.size,
			members: client.guilds.cache
				.map((c: any) => c.memberCount)
				.filter((v: any) => typeof v === 'number')
				.reduce((a: any, b: any) => a + b, 0),
		});
		const time = moment().unix();
		const uuid = randomUUID().replace(/-/gi, '');
		const res = await fetch(`http://${ip}:10106/api?cmd=1101&region=dev_docker&ticket=GM%${time}&sign=${uuid}`);
		console.log(res);
		setInterval(() => {
			client.user.setActivity('Genshin Impact', {type: ActivityType.Watching});
		}, 300);
	},
};

export default event;
