const mongoose = require('mongoose');
const db = mongoose.connection.useDb("ServerBank")
const Loan = new mongoose.Schema({
	_id: {
        type:String,
        require:true
    },
	balance: {
	    type: mongoose.SchemaTypes.Number,
	    default: 0
	},
	payday: {
	    type: Date,
        default: Date.now
	}
},{ timestamps: true });

module.exports = db.model('Loan', Loan, 'ServerLoan');