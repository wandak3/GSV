import {
  SlashCommandBuilder,
  CommandInteraction,
  Collection,
  PermissionResolvable,
  Message,
  AutocompleteInteraction,
  Client,
  DateResolvable,
  Channel,
} from "discord.js";
import EventEmitter from "events";

type GuildOptions = {
  prefix: string;
};

type GuildProperties = {
  giveawayList: GuildGiveaway[];
  bonusList: BonusEntries[];
};

export type SlashCommand = {
  command: SlashCommandBuilder | any;
  cooldown?: number;
  autocomplete?: (interaction: AutocompleteInteraction) => void;
  execute: (interaction: CommandInteraction) => void;
};

export type Command = {
  name: string;
  permissions: Array<PermissionResolvable>;
  aliases: Array<string>;
  cooldown?: number;
  execute: (message: Message, args: Array<string>) => void;
};

export type BotEvent = {
  name: string;
  once?: boolean | false;
  execute: (...args) => void;
};

export type GuildOption = keyof GuildOptions;

export type GuildProperty = keyof GuildProperties;

export interface IGuild extends mongoose.Document {
  guildID: string;
  options: GuildOptions;
  properties: GuildProperties;
  joinedAt: Date;
}

declare module "discord.js" {
  export interface Client {
    slashCommands: Collection<string, SlashCommand>;
    commands: Collection<string, Command>;
    cooldowns: Collection<string, number>;
    database: Collection<string, IGuild>;
    doneGiveaway: GiveawayWinner[];
  }
}
