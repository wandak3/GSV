import { SlashCommandBuilder, CommandInteraction, Collection, PermissionResolvable, Message, AutocompleteInteraction } from "discord.js"

export interface SlashCommand {
    command: SlashCommandBuilder | any,
    autocomplete?: (interaction: AutocompleteInteraction) => void,
    cooldown?: number,
    execute: (interaction : CommandInteraction) => void,
}

export interface Command {
    name: string,
    permissions: Array<PermissionResolvable>,
    aliases: Array<string>,
    cooldown?: number,
    execute: (message: Message, args: Array<string>) => void
}

interface GuildOptions {
    prefix: string
}

export type GuildOption = keyof GuildOptions

export interface IGuild extends mongoose.Document {
    guildID: string,
    options: GuildOptions
    joinedAt: Date
}

export interface BotEvent {
    name: string,
    once?: boolean | false,
    execute: (...args?) => void
}

declare module "discord.js" {
    export interface Client {
        slashCommands: Collection<string, SlashCommand>,
        commands: Collection<string, Command>,
        cooldowns: Collection<string, number>,
        database: Array;
    }
}