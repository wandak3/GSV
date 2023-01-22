const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: './models/SQLite/message.sqlite',
});

const SQLite = sequelize.define('message', {
	_id: {
		type: Sequelize.STRING,
		unique: true,
	},
	message_number: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
	}
});

module.exports = SQLite;