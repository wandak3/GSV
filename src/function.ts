import {
  Guild,
  GuildMember,
  PermissionFlagsBits,
  PermissionResolvable,
  TextChannel,
} from "discord.js";
import { prisma } from "./database/prisma";
import { GuildOption } from "./types";
import GuildModel from "./database/guild";
import mongoose from "mongoose";
import { schedule } from "./data/schedule";
import type { t_gacha_schedule_config } from "@prisma/client";

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

export async function getGachaScheduleConfig() {
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
  fiveStar: string,
  fourStar1: string,
  fourStar2: string,
  fourStar3: string,
  start: Date,
  end: Date
) => {};

export const findGachaData = (name: string) =>
  schedule.filter((data) => data.value === name);
