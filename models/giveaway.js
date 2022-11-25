const mongoose = require('mongoose');

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
    requirement: {
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

module.exports = mongoose.model('Giveaway', Giveaway, 'Giveaway');
