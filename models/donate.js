const mongoose = require('mongoose');
const db = mongoose.connection.useDb("ServerBank")
const Donate = new mongoose.Schema({
	_id: {
        type:String,
        require:true
    },
	balance: {
	    type: mongoose.SchemaTypes.Number,
	    default: 0
	},
	credit: {
	    type: mongoose.SchemaTypes.Number,
	    default: 100
	}
},{ timestamps: true });

module.exports = db.model('Donate', Donate, 'ServerDonate');