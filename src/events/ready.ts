import {BotEvent} from '../types';

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
	},
};

export default event;
