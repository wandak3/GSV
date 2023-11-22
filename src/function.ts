import {Guild, GuildMember, PermissionFlagsBits, PermissionResolvable, TextChannel, User} from 'discord.js';
import {GachaTypeGuard, GuildOption, UserOption} from './types';
import GuildModel from './schemas/Guild';
import UserModel from './schemas/User';
import mongoose from 'mongoose';
import {schedule} from './data/schedule';
import {PrismaClient} from '@prisma/client';
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

export const checkGuildDatabase = async (guild: Guild) => {
	if (mongoose.connection.readyState === 0) throw new Error('Database not connected.');
	const guildb = await GuildModel.findOne({guildID: guild.id});
	if (!guildb) {
		const newGuild = new GuildModel({
			guildID: guild.id,
			options: {},
			joinedAt: Date.now(),
		});
		newGuild.save();
	}
};

export const createGuildDatabase = async (guild: Guild) => {
	if (mongoose.connection.readyState === 0) throw new Error('Database not connected.');
	const newGuild = new GuildModel({
		guildID: guild.id,
		options: {},
		joinedAt: Date.now(),
	});
	newGuild.save();
};

export const getGuildOption = async (guild: Guild, option: GuildOption) => {
	if (mongoose.connection.readyState === 0) throw new Error('Database not connected.');
	const guildb = await GuildModel.findOne({guildID: guild.id});
	if (!guildb) return null;
	return guildb.options[option];
};

export const setGuildOption = async (guild: Guild, option: GuildOption, value: any) => {
	if (mongoose.connection.readyState === 0) throw new Error('Database not connected.');
	const guildb = await GuildModel.findOne({guildID: guild.id});
	if (!guildb) return;
	guildb.options[option] = value;
	guildb.save();
};

export const getUserOption: any = async (user: User, option: UserOption) => {
	if (mongoose.connection.readyState === 0) throw new Error('Database not connected.');
	const userdb = await UserModel.findOne({userID: user.id});
	if (!userdb) return null;
	return userdb.options[option];
};

export const setUserOption = async (user: User, option: UserOption, value: any) => {
	if (mongoose.connection.readyState === 0) throw new Error('Database not connected.');
	const userdb = await UserModel.findOne({userID: user.id});
	if (!userdb) {
		const newUser = new UserModel({
			userID: user.id,
			options: {
				link: '',
			},
			joinedAt: Date.now(),
		});
		newUser.save();
	} else {
		if (Array.isArray(userdb.options[option])) {
			const index = userdb.options[option] as Array<any>;
			index.push(value);
		} else {
			userdb.options[option] = value;
		}
		userdb.save();
	}
};

export async function getGachaScheduleConfig(url: string) {
	const prisma = new PrismaClient({datasources: {db: {url: url}}});
	try {
		await prisma.$connect();
		const banners = await prisma.t_gacha_schedule_config.findMany();
		return banners;
	} catch (err: any) {
		console.log('Error: ' + err.message);
	} finally {
		await prisma.$disconnect();
	}
}
/* Update sự kiện ước nguyện lên SQL */
export const updateGachaScheduleConfig = async ({
	url,
	scheduleId,
	gachaType,
	gachaPropRuleId,
	start,
	end,
	/* Weapon */
	weapon,
}: {
	url: string;
	scheduleId: number;
	gachaType: number;
	gachaPropRuleId: number;
	start: Date;
	end: Date;
	/* Weapon */
	weapon?: string;
}) => {
	const prisma = new PrismaClient({datasources: {db: {url: url}}});
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
export const deleteGachaScheduleConfig = async (url: string, schedule_id: number) => {
	try {
		const prisma = new PrismaClient({datasources: {db: {url: url}}});
		await prisma.t_gacha_schedule_config.delete({where: {schedule_id: schedule_id}});
	} catch (err: any) {
		console.log(err.message);
		return err.message;
	}
};
/* Update sự kiện lên SQL */
export const getEventScheduleConfig = async (url: string) => {
	try {
		const prisma = new PrismaClient({datasources: {db: {url: url}}});
		const data = await prisma.t_activity_schedule_config.findMany();
		return data;
	} catch (err: any) {
		return err.message;
	}
};
/* Update sự kiện lên SQL */
export const deleteEventScheduleConfig = async (url: string, schedule_id: number) => {
	try {
		const prisma = new PrismaClient({datasources: {db: {url: url}}});
		const data = await prisma.t_activity_schedule_config.delete({where: {schedule_id: schedule_id}});
		return data;
	} catch (err: any) {
		return err.message;
	}
};
/* Update sự kiện lên SQL */
export const updateEventScheduleConfig = async (url: string, event: string, start: Date, end: Date) => {
	const uploadData: t_activity_schedule_config = {
		schedule_id: Number(event),
		begin_time: start,
		end_time: end,
	};
	try {
		const prisma = new PrismaClient({
			datasources: {db: {url: url}},
		});
		await prisma.t_activity_schedule_config.create({data: uploadData});
	} catch (err: any) {
		return err.message;
	}
};
/* Function tìm database */
export const getGachadata = (name: string) => schedule.filter((data) => data.value.includes(name));
