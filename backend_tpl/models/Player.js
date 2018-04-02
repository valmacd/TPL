const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const playerSchema = new Schema ({
    playerName: {
        type: String,
        required: true
    },
    playerId: {
        type: String,
        required: true,
        unique: true
    },
    gender: {
        type: String,
        required: true
    }
});

const PlayerModel = mongoose.model('Player',playerSchema);

module.exports= PlayerModel;