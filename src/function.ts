import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	CommandInteraction,
	ComponentType,
	GuildMember,
	PermissionFlagsBits,
	PermissionResolvable,
	TextChannel,
} from 'discord.js';
import {schedule} from './data/schedule';
import prisma from './prisma/prisma';
import prisma_second from './prisma/prisma-second';
import type {t_gacha_schedule_config, t_activity_schedule_config} from '@prisma/client';

export const checkPermissions = (member: GuildMember, permissions: Array<PermissionResolvable>) => {
	const neededPermissions: PermissionResolvable[] = [];
	permissions.forEach((permission) => {
		if (!member.permissions.has(permission)) neededPermissions.push(permission);
	});
	if (neededPermissions.length === 0) return null;
	return neededPermissions.map((p) => {
		if (typeof p === 'string') return p.split(/(?=[A-Z])/).join(' ');
		else
			return Object.keys(PermissionFlagsBits)
				.find((k) => Object(PermissionFlagsBits)[k] === p)
				?.split(/(?=[A-Z])/)
				.join(' ');
	});
};

export const sendTimedMessage = (message: string, channel: TextChannel, duration: number) => {
	channel.send(message).then((m) => setTimeout(async () => (await channel.messages.fetch(m)).delete(), duration));
	return;
};

export async function getGachaScheduleConfig() {
	try {
		const banners = await prisma.t_gacha_schedule_config.findMany();
		return banners;
	} catch (err: any) {
		console.log('Error: ' + err.message);
	}
}
/* Update sự kiện ước nguyện lên SQL */
export const updateGachaScheduleConfig = async ({
	scheduleId,
	gachaType,
	gachaPropRuleId,
	start,
	end,
	/* Weapon */
	weapon,
}: {
	scheduleId: number;
	gachaType: number;
	gachaPropRuleId: number;
	start: Date;
	end: Date;
	/* Weapon */
	weapon?: string;
}) => {
	try {
		const _schedule = schedule.find((e) => e.scheduleId === scheduleId) ?? schedule[0];
		const rateUpItems5 = !weapon ? _schedule.rateUpItems5.toString() : weapon;
		const rateUpItems4 = _schedule.rateUpItems4.toString();
		const prob = gachaPropRuleId === 1 ? 500 : 750;
		await prisma.$connect();
		const scheduleSchema: t_gacha_schedule_config = {
			schedule_id: scheduleId,
			gacha_type: gachaType,
			begin_time: start,
			end_time: end,
			cost_item_id: 223,
			cost_item_num: 1,
			gacha_pool_id: 201,
			gacha_prob_rule_id: gachaPropRuleId,
			gacha_up_config: `{\"gacha_up_list\":[{\"item_parent_type\":1,\"prob\":${prob},\"item_list\":[${rateUpItems5}]},{\"item_parent_type\":2,\"prob\":500,\"item_list\":[${rateUpItems4}]}]}`,
			gacha_rule_config: '{}',
			gacha_prefab_path: _schedule.prefabPath,
			gacha_preview_prefab_path: _schedule.previewprefabPath,
			gacha_prob_url: '',
			gacha_record_url: '',
			gacha_prob_url_oversea: '',
			gacha_record_url_oversea: '',
			gacha_sort_id: _schedule.sortId,
			enabled: 1,
			title_textmap: _schedule.titlePath,
			display_up4_item_list: _schedule.rateUpItems4.toString(),
		};
		await prisma.t_gacha_schedule_config.create({
			data: scheduleSchema,
		});
	} catch (err: any) {
		return err;
	} finally {
		await prisma.$disconnect();
	}
};
export const deleteGachaScheduleConfig = async (schedule_id: number) => {
	try {
		await prisma.t_gacha_schedule_config.delete({where: {schedule_id: schedule_id}});
	} catch (err: any) {
		console.log(err.message);
		return err.message;
	}
};
/* Update sự kiện lên SQL */
export const getEventScheduleConfig = async () => {
	try {
		const data = await prisma.t_activity_schedule_config.findMany();
		return data;
	} catch (err: any) {
		return err.message;
	}
};
/* Update sự kiện lên SQL */
export const deleteEventScheduleConfig = async (schedule_id: number) => {
	try {
		const data = await prisma.t_activity_schedule_config.delete({where: {schedule_id: schedule_id}});
		return data;
	} catch (err: any) {
		return err.message;
	}
};
/* Update sự kiện lên SQL */
export const updateEventScheduleConfig = async (event: string, start: Date, end: Date) => {
	const uploadData: t_activity_schedule_config = {
		schedule_id: Number(event),
		begin_time: start,
		end_time: end,
		desc: '',
	};
	try {
		await prisma.t_activity_schedule_config.create({data: uploadData});
	} catch (err: any) {
		return err.message;
	}
};

export const getUsers = async () => {
	try {
		const user = process.env.USER_URL;
		const data = await prisma_second.t_player_uid.findMany();
		return data;
	} catch (err: any) {
		return err.message;
	}
};

/* Function Data Users */
/* http://wumpus.site:14861/api?cmd=1004&region=dev_gio&ticket=GM&uid=${uid} : Lấy thông tin tower */
/* http://wumpus.site:14861/api?cmd=1004&region=dev_gio&ticket=GM&uid=${uid} : Lấy thông tin tower */

export const getPlayerData = async (uid: string, char: string) => {
	const userData = await fetch(`http://wumpus.site:14861/api?cmd=1004&region=dev_gio&ticket=GM&uid=${uid}`);
	const itemData = await fetch(`http://wumpus.site:14861/api?cmd=1016&region=dev_gio&ticket=GM&uid=${uid}`);
	const player = await userData.json()
	const item = await itemData.json()
	// Player Data
	const player_data = player?.data?.bin_data?.avatar_bin?.avatar_list
	const player_found_data = player_data.find((e: any) => e.avatar_id == Number(char));
	// Item Data
	const item_data = item?.data?.item_bin_data?.pack_store?.item_list
	if (player_found_data?.formal_avatar) {
		const item_list = player_found_data?.formal_avatar?.equip_guid_list;
		const item_finding = item_list.map((item: number) => {
			const found_item = item_data.find((requilary: any) => requilary?.guid == item);
			return found_item?.equip?.reliquary;
		})
		if (!item_finding) return undefined;
	} else {
		const item_list = player_found_data?.equip_list;
	}
};

export const getTowerBin = async (uid: string | number) => {
	try {
		const rawBin = await fetch(`http://wumpus.site:14861/api?cmd=1004&region=dev_gio&ticket=GM&uid=${uid}`);
		const bin = await rawBin.json()
		const tower_monthly_summary_map = bin.data.bin_data.tower_bin.tower_monthly_summary_map;
		return {
			nickname: bin.data.nickname,
			tower_monthly_summary_map: tower_monthly_summary_map
		};
	} catch (err: any) {
		return err.message;
	}
};

export const fetchUsers = async (
	ip: string,
	sender: string,
	title: string,
	description: string,
	item: string,
	seconds: string,
	uuid: string
) => {
	const users = await getUsers();
	type User = {
		uid: number;
		account_type: number;
		account_uid: string;
		create_time: Date;
		ext: string;
		tag: number;
	};
	users.map(async (user: User) => {
		await fetch(
			`http://${ip}:14861/api?sender=${sender}&title=${title}&content=${description}&item_list=${item}&expire_time=${seconds}&is_collectible=False&uid=${user.uid}&cmd=1005&region=dev_gio&ticket=GM%40${seconds}&sign=${uuid}`
		);
	});
	return;
};
/* Function tìm database */
export const getGachadata = (name: string) => schedule.filter((data) => data.value.includes(name));
/* Function substats */
export const extractSubstats = (substatsString: string) => {
	const substatsArray = substatsString.split(' ');
	const substats = substatsArray.flatMap((substat) => {
		const parts = substat.split(',');
		if (parts.length === 2) {
			return new Array(parseInt(parts[1])).fill(parts[0]);
		}
		return [];
	});
	return substats;
};

/* Function Pagination */
export const pagination = async (interaction: CommandInteraction, pages: any[], time: number) => {
	if (pages.length === 1) {
		const page = await interaction.editReply({
			embeds: [pages[0]],
			components: [],
		});
		return page;
	}
	const prev = new ButtonBuilder()
		.setCustomId('prev')
		.setLabel('Previous')
		.setStyle(ButtonStyle.Primary)
		.setDisabled(true);

	const next = new ButtonBuilder().setCustomId('next').setLabel('Next').setStyle(ButtonStyle.Primary);

	const buttonRow = new ActionRowBuilder<ButtonBuilder>().addComponents([prev, next]);
	let index = 0;
	const currentPage = await interaction.editReply({
		embeds: [pages[index]],
		components: [buttonRow],
	});

	const collector = await currentPage.createMessageComponentCollector({
		componentType: ComponentType.Button,
		time,
	});

	collector.on('collect', async (i) => {
		if (i.user.id !== interaction.user.id) {
			await i.reply({
				content: 'Bạn không có quyền sử dụng lệnh này.',
				ephemeral: true,
			});
		}
		await i.deferUpdate();

		if (i.customId === 'prev') {
			index--;
			prev.setDisabled(index === 0);
			next.setDisabled(false);
		} else if (i.customId === 'next') {
			index++;
			prev.setDisabled(false);
			next.setDisabled(index === pages.length - 1);
		}

		await currentPage.edit({
			embeds: [pages[index]],
			components: [buttonRow],
		});

		collector.resetTimer();
	});

	collector.on('end', async () => {
		await currentPage.edit({
			embeds: [pages[index]],
			components: [],
		});
	});
	return currentPage;
};

export async function getPlayerOnline() {
	try {
		const ip = process.env.IP;
		const res = await fetch(`http://${ip}:14861/api?cmd=1101&region=dev_gio&ticket=GM`);
		const json = await res.json();
		return json.data.online_player_num_except_sub_account
	} catch (error) {
		return "down"
	}
}
