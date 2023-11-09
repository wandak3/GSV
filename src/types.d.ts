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
} from 'discord.js';
import EventEmitter from 'events';

type GuildOptions = {
	prefix: string;
};

type UserOptions = {
	link: string;
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

export type UserOption = keyof UserOptions;

export type GuildProperty = keyof GuildProperties;

export interface IGuild extends mongoose.Document {
	guildID: string;
	options: GuildOptions;
	joinedAt: Date;
}

export interface IUser extends mongoose.Document {
	userID: string;
	options: UserOptions;
	joinedAt: Date;
}

declare module 'discord.js' {
	export interface Client {
		slashCommands: Collection<string, SlashCommand>;
		commands: Collection<string, Command>;
		cooldowns: Collection<string, number>;
		database: Collection<string, IGuild>;
		doneGiveaway: GiveawayWinner[];
	}
}
