const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const rawScheduleSchema = new Schema ({
    gameId: {
        type: String,
        required: true
    },
    leagueId: {
        type: String,
        required: true  
    },
    date: {
        type: String,
        required: true  
    },
    homeTeam: {
        type: String,
        required: true  
    },
    homeTeamId: {
        type: String,
        required: true  
    },
    awayTeam: {
        type: String,
        required: true  
    },
    awayTeamId: {
        type: String,
        required: true  
    }
});

const RawScheduleModel = mongoose.model('RawSchedule',rawScheduleSchema);

module.exports= RawScheduleModel;