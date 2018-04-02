const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const gameSchema = new Schema ({
    gameId: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true
    },
    teamId: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    roster: {
        type: Array,
        required: true
    }
});

const GameModel = mongoose.model('Game',gameSchema);

module.exports= GameModel;