const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const rawEventSchema = new Schema ({
    gameId: {
        type: String,
        required: true
    },
    teamId: {
        type: String,
        required: true
    },
    sequence: {
        type: String,
        required: true
    },
    eventType: {
        type: String,
        required: true
    },
    playerId: {
        type: String,
        required: true
    },
    playerName: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    }
});

const RawEventModel = mongoose.model('RawEvent',rawEventSchema);

module.exports= RawEventModel;