const mongoose = require('mongoose');
const db = mongoose.connection.useDb("ServerBot")
const Giveaway = new mongoose.Schema({
    _id: {
        type: mongoose.SchemaTypes.String,
        require: true
    },
    channel: {
        type: mongoose.SchemaTypes.String
    },
    message: {
        type: mongoose.SchemaTypes.String
    },
    role: {
        type: mongoose.SchemaTypes.String
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
    attachment: {
        type: mongoose.SchemaTypes.String
    },
    description: {
        type: mongoose.SchemaTypes.String
    },
    join: {
        type: mongoose.SchemaTypes.Array,
        default: []
    },
    time: {
        type: mongoose.SchemaTypes.Date
    }
});

module.exports = db.model('Giveaway', Giveaway, 'Giveaway');