const mongoose = require('mongoose');
const db = mongoose.connection.useDb("ServerBot")
const Reroll = new mongoose.Schema({
    _id: {
        type: mongoose.SchemaTypes.String,
        require: true
    },
    winner: {
        type: mongoose.SchemaTypes.Number
    },
    title: {
        type: mongoose.SchemaTypes.String
    },
    thumbnail: {
        type: mongoose.SchemaTypes.String
    },
    join: {
        type: mongoose.SchemaTypes.Array,
        default: []
    }
});

module.exports = db.model('Reroll', Reroll, 'Reroll');