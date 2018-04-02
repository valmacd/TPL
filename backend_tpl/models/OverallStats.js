const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const overallStatsSchema = new Schema ({
    playerName: {
        type: String,
        required: true,
    },
    playerId: {
        type: String,
        required: true,
        unique: true
    },
    gender: {
        type: String,
        required: true
    },
    gamesPlayed: {
        type: Number,
        require: true
    },
    goalsTot: {
        type: Number,
        required: true
    },
    assistTot: {
        type: Number,
        required: true
    },
    secondAssistTot: {
        type: Number,
        required: true
    },
    throwAwayTot: {
        type: Number,
        required: true
    },
    receiverErrorTot: {
        type: Number,
        required: true
    },
    blockTot: {
        type: Number,
        required: true
    },
    connectedPassTot: {
        type: Number,
        required: true    
    },
    value: {
        type: Number,
        required: true    
    }
});

const OverallStatsModel = mongoose.model('OverallStats',overallStatsSchema);

module.exports= OverallStatsModel;