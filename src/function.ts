import {
  Guild,
  GuildMember,
  PermissionFlagsBits,
  PermissionResolvable,
  TextChannel,
  User,
} from "discord.js";
import { GuildOption, UserOption } from "./types";
import GuildModel from "./schemas/Guild";
import UserModel from "./schemas/User";
import mongoose from "mongoose";
import { schedule } from "./data/schedule";
import { scheduleData } from "./data/scheduleData";
import { PrismaClient } from "@prisma/client";
import type {
  t_gacha_schedule_config,
  t_activity_schedule_config,
} from "@prisma/client";

export const checkPermissions = (
  member: GuildMember,
  permissions: Array<PermissionResolvable>
) => {
  let neededPermissions: PermissionResolvable[] = [];
  permissions.forEach((permission) => {
    if (!member.permissions.has(permission)) neededPermissions.push(permission);
  });
  if (neededPermissions.length === 0) return null;
  return neededPermissions.map((p) => {
    if (typeof p === "string") return p.split(/(?=[A-Z])/).join(" ");
    else
      return Object.keys(PermissionFlagsBits)
        .find((k) => Object(PermissionFlagsBits)[k] === p)
        ?.split(/(?=[A-Z])/)
        .join(" ");
  });
};

export const sendTimedMessage = (
  message: string,
  channel: TextChannel,
  duration: number
) => {
  channel
    .send(message)
    .then((m) =>
      setTimeout(
        async () => (await channel.messages.fetch(m)).delete(),
        duration
      )
    );
  return;
};

export const checkGuildDatabase = async (guild: Guild) => {
  if (mongoose.connection.readyState === 0)
    throw new Error("Database not connected.");
  let guildb = await GuildModel.findOne({ guildID: guild.id });
  if (!guildb) {
    let newGuild = new GuildModel({
      guildID: guild.id,
      options: {},
      joinedAt: Date.now(),
    });
    newGuild.save();
  }
};

export const createGuildDatabase = async (guild: Guild) => {
  if (mongoose.connection.readyState === 0)
    throw new Error("Database not connected.");
  let newGuild = new GuildModel({
    guildID: guild.id,
    options: {},
    joinedAt: Date.now(),
  });
  newGuild.save();
};

export const getGuildOption: any = async (
  guild: Guild,
  option: GuildOption
) => {
  if (mongoose.connection.readyState === 0)
    throw new Error("Database not connected.");
  let guildb = await GuildModel.findOne({ guildID: guild.id });
  if (!guildb) return null;
  return guildb.options[option];
};

export const setGuildOption = async (
  guild: Guild,
  option: GuildOption,
  value: any
) => {
  if (mongoose.connection.readyState === 0)
    throw new Error("Database not connected.");
  let guildb = await GuildModel.findOne({ guildID: guild.id });
  if (!guildb) return;
  guildb.options[option] = value;
  guildb.save();
};

export const getUserOption: any = async (user: User, option: UserOption) => {
  if (mongoose.connection.readyState === 0)
    throw new Error("Database not connected.");
  let userdb = await UserModel.findOne({ userID: user.id });
  if (!userdb) return null;
  return userdb.options[option];
};

export const setUserOption = async (
  user: User,
  option: UserOption,
  value: any
) => {
  if (mongoose.connection.readyState === 0)
    throw new Error("Database not connected.");
  let userdb = await UserModel.findOne({ userID: user.id });
  if (!userdb) {
    let newUser = new UserModel({
      userID: user.id,
      options: {
        link: "",
      },
      joinedAt: Date.now(),
    });
    newUser.options[option] = value;
    newUser.save();
  } else {
    userdb.options[option] = value;
    userdb.save();
  }
};

export async function getGachaScheduleConfig() {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });
  try {
    await prisma.$connect();
    const banners = await prisma.t_gacha_schedule_config.findMany();
    return banners;
  } catch (err: any) {
    console.log("Error: " + err.message);
  } finally {
    await prisma.$disconnect();
  }
}

export const updateGachaScheduleConfig = async (
  url: string,
  scheduleId: number,
  start: Date,
  end: Date
) => {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: url,
      },
    },
  });
  try {
    await prisma.$connect();
    const checkGachaType = await prisma.t_gacha_schedule_config.findFirst({
      where: { gacha_type: scheduleData[scheduleId].gachaType },
    });
    const scheduleSchema: t_gacha_schedule_config = {
      schedule_id: scheduleId,
      gacha_type: scheduleData[scheduleId].gachaType,
      begin_time: start,
      end_time: end,
      cost_item_id: 223,
      cost_item_num: 1,
      gacha_pool_id: 201,
      gacha_prob_rule_id: 1,
      gacha_up_config: `{\"gacha_up_list\":[{\"item_parent_type\":1,\"prob\":500,\"item_list\":[${scheduleData[
        scheduleId
      ].rateUpItems5.toString()}]},{\"item_parent_type\":2,\"prob\":500,\"item_list\":[${scheduleData[
        scheduleId
      ].rateUpItems4.toString()}]}]}`,
      gacha_rule_config: "{}",
      gacha_prefab_path: scheduleData[scheduleId].prefabPath,
      gacha_preview_prefab_path: scheduleData[scheduleId].prefabPath,
      gacha_prob_url: "",
      gacha_record_url: "",
      gacha_prob_url_oversea: "",
      gacha_record_url_oversea: "",
      gacha_sort_id: scheduleData[scheduleId].sortId,
      enabled: 1,
      title_textmap: scheduleData[scheduleId].titlePath,
      display_up4_item_list: scheduleData[scheduleId].rateUpItems4.toString(),
    };
    await prisma.t_gacha_schedule_config.create({
      data: scheduleSchema,
    });
  } catch (err: any) {
    console.log("Error: " + err.message);
  } finally {
    await prisma.$disconnect();
  }
};

export const updateEventScheduleConfig = async (
  event: string,
  start: Date,
  end: Date
) => {
  const uploadData: t_activity_schedule_config = {
    schedule_id: Number(event),
    begin_time: start,
    end_time: end,
  };
  try {
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });
    await prisma.t_activity_schedule_config.create({
      data: uploadData,
    });
  } catch (err: any) {
    return err.message;
  }
};

export const findGachaData = (name: string) =>
  schedule.filter((data) => data.value === name);

export const findSchedule = (id: number) =>
  schedule.find((data) => data.scheduleId === id);
