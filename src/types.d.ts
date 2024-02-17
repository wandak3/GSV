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

type UserOptions = {
	schedule: Array<GachaTypeGuard>;
};

export type SlashCommand = {
	command: SlashCommandBuilder | any;
	cooldown?: number;
	autocomplete?: (interaction: AutocompleteInteraction, client?: Client) => void;
	execute: (interaction: CommandInteraction, client?: Client) => void;
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

export type User = {
	uid: number;
	account_type: number;
	account_uid: string;
	create_time: Date;
	ext: string;
	tag: number;
};

declare module 'discord.js' {
	export interface Client {
		slashCommands: Collection<string, SlashCommand>;
		commands: Collection<string, Command>;
		cooldowns: Collection<string, number>;
	}
}
