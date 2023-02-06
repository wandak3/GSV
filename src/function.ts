import { Guild, GuildMember, GuildMemberRoleManager, PermissionFlagsBits, PermissionResolvable, TextChannel, User } from "discord.js";
import { BonusEntries, GuildGiveaway, GuildOption, GuildProperty } from "./types";
import GuildModel from "./database/guild"
import mongoose from "mongoose";

export const checkPermissions = (member: GuildMember, permissions: Array<PermissionResolvable>) => {
    let neededPermissions: PermissionResolvable[] = []
    permissions.forEach(permission => {
        if (!member.permissions.has(permission)) neededPermissions.push(permission)
    })
    if (neededPermissions.length === 0) return null
    return neededPermissions.map(p => {
        if (typeof p === "string") return p.split(/(?=[A-Z])/).join(" ")
        else return Object.keys(PermissionFlagsBits).find(k => Object(PermissionFlagsBits)[k] === p)?.split(/(?=[A-Z])/).join(" ")
    })
}

export const sendTimedMessage = (message: string, channel: TextChannel, duration: number) => {
    channel.send(message)
        .then(m => setTimeout(async () => (await channel.messages.fetch(m)).delete(), duration))
    return
}

export const checkGuildDatabase = async (guild: Guild) => {
    if (mongoose.connection.readyState === 0) throw new Error("Database not connected.")
    let guildb = await GuildModel.findOne({ guildID: guild.id })
    if (!guildb) {
        let newGuild = new GuildModel({
            guildID: guild.id,
            options: {},
            joinedAt: Date.now()
        })
        newGuild.save()
    }
}

export const getGuildOption: any = async (guild: Guild, option: GuildOption) => {
    if (mongoose.connection.readyState === 0) throw new Error("Database not connected.");
    let guildb = await GuildModel.findOne({ guildID: guild.id });
    if (!guildb) return null;
    return guildb.options[option];
}

export const setGuildOption = async (guild: Guild, option: GuildOption, value: any) => {
    if (mongoose.connection.readyState === 0) throw new Error("Database not connected.")
    let guildb = await GuildModel.findOne({ guildID: guild.id })
    if (!guildb) return;
    guildb.options[option] = value
    guildb.save()
}

export const getGuildProperties: any = async (guild: Guild, option: GuildProperty) => {
    if (mongoose.connection.readyState === 0) throw new Error("Database not connected.");
    let guildb = await GuildModel.findOne({ guildID: guild.id });
    return guildb!.properties[option];
}

export const setGuildProperties = async (guild: Guild, option: GuildProperty, value: any) => {
    if (mongoose.connection.readyState === 0) throw new Error("Database not connected.")
    let guildb = await GuildModel.findOne({ guildID: guild.id })
    if (!guildb) return;
    guildb.properties[option] = value
    guildb.save()
}

export const pushGuildProperties = async (guild: Guild, option: GuildProperty, value: any) => {
    if (mongoose.connection.readyState === 0) throw new Error("Database not connected.")
    let guildb = await GuildModel.findOne({ guildID: guild.id })
    if (!guildb) return;
    guildb.properties[option].push(value)
    guildb.save()
}

export const pullGuildProperties = async (guild: Guild, option: GuildProperty, key: any, value: any) => {
    if (mongoose.connection.readyState === 0) throw new Error("Database not connected.")
    await GuildModel.findOneAndUpdate(
        { guildID: guild.id }, { $pull: { [ `properties.${option}` ]: { [`${key}`]: value } } }, 
        { safe: true, upsert: true }
    );
}

export const getGiveaway = (giveaways: GuildGiveaway[], interaction_customId: string) => {
    const interaction_id = interaction_customId.replace('joinGiveaway|', '');
    let found = giveaways.find(giveaway => {
        return giveaway.id === interaction_id;
    });
    return found;
}

export const updateGiveawayEntries = async (guild: Guild, guildGiveaway: GuildGiveaway) => {
    if (mongoose.connection.readyState === 0) throw new Error("Database not connected.")
    await GuildModel.findOneAndUpdate(
        { "properties.giveawayList.id": guildGiveaway.id  },
        { 
            "$set": {
                "properties.giveawayList.$.entries": guildGiveaway.entries
            } 
        },
    )
}

export const getBonusEntries = (bonusList: BonusEntries[], interaction_roles: GuildMemberRoleManager, interaction_user: User) => {
    if (!bonusList) return 1;
    let found = bonusList.find(roleid => {
        return interaction_roles.cache.find(role => {
            return roleid.roleid === role.id;
        });
    });
    if (!found) return 1
    return found.bonus;
}

export const updateBonusEntries = async (guild: Guild, bonus: BonusEntries) => {
    if (mongoose.connection.readyState === 0) throw new Error("Database not connected.")
    await GuildModel.findOneAndUpdate(
        { "properties.bonusList.roleid": bonus.roleid  },
        { 
            "$set": {
                "properties.bonusList.$.bonus": bonus.bonus
            } 
        },
    )
}

export const checkTime = (time: number) => {
    return Date.now() - time;
}