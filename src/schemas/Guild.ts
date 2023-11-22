import {Schema, model} from 'mongoose';
import {IGuild} from '../types';

const GuildSchema = new Schema<IGuild>({
	guildID: {required: true, type: String},
	options: {
		prefix: {type: String, default: process.env.PREFIX},
		link: {type: String, default: 'mysql://root:Wumpus@2023@35.215.183.254:3306/db_hk4e_config'},
		address: {type: String, default: ''},
	},
});

const GuildModel = model('guild', GuildSchema);

export default GuildModel;
