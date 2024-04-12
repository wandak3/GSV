import moment from 'moment';
import { CronJob } from 'cron';
import { getGachaScheduleConfig, getPlayerOnline } from '../function';
import {BotEvent} from '../types';
import {ActivityType, Client} from 'discord.js';
import prisma from '../prisma/prisma';

const event: BotEvent = {
	name: 'ready',
	once: true,
	execute: async (client: Client) => {
		console.table({
			users: client.user?.tag,
			online: await getPlayerOnline(),
		});
		const job = new CronJob(
			'* * 0 * * *', // cronTime
			async function () {
				const data = await getGachaScheduleConfig();
				if (!data) return;
				data.forEach(async (e) => {
					const compare = moment(e.end_time).isBefore(moment());
					if(e.enabled === 1 && compare) {
						await prisma.t_gacha_schedule_config.update({
							where: {schedule_id: e.schedule_id},
							data: {enabled: 0},
						});
					}
				});
			},
			null, // onComplete
			true, // start
			'Asia/Ho_Chi_Minh' // timeZone
		);
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
