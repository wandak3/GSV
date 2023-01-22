const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: './models/SQLite/blackList.sqlite',
});

const SQLite = sequelize.define('blackList', {
	_id: {
		type: Sequelize.STRING,
		unique: true,
	}
});

module.exports = SQLite;