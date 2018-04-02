const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const statsSchema = new Schema ({
    playerId: {
        type: String,
        required: true,
    },
    gameId: {
        type: String,
        required: true,
    },
    goals: {
        type: Number,
        required: true
    },
    assist: {
        type: Number,
        required: true
    },
    secondAssist: {
        type: Number,
        required: true
    },
    throwAway: {
        type: Number,
        required: true
    },
    receiverError: {
        type: Number,
        required: true
    },
    block: {
        type: Number,
        required: true
    },
    connectedPass : {
        type: Number,
        required: true    
    }
});

const StatsModel = mongoose.model('Stat',statsSchema);

module.exports= StatsModel;