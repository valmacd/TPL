const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

const teamSchema = new Schema ({
    teamName: {
        type: String,
        required: true,
        unique: true
    },
    teamId: {
        type: Number,
        required: true,
        unique: true
    }
});

const TeamModel = mongoose.model('Team',teamSchema);

module.exports= TeamModel;