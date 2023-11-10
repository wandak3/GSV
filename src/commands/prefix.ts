import {setGuildOption} from '../function';
import {Command} from '../types';

const command: Command = {
	name: 'prefix',
	permissions: ['Administrator'],
	aliases: [],
	cooldown: 10,
	execute: (message, args) => {
		const prefix = args[1];
		if (!prefix) return message.channel.send('No prefix provided');
		if (!message.guild) return;
		setGuildOption(message.guild, 'prefix', prefix);
		message.channel.send('Prefix successfully changed!');
	},
};

export default command;
