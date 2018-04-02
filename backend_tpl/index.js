const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      cors = require('cors'),
      axios = require('axios'),
      mongoose = require('mongoose'),
      _ = require('underscore');

const writingDB = require('./lib/writingDB');
const stats = require('./routes/stats');

const mongoConnectionString = 'mongodb://localhost/TPL';

mongoose.connect(mongoConnectionString);
const connection = mongoose.connection;




connection.on('open', () => {
    console.log('connected to mongo!');
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//figure out how to call a function in a function using this method 
// // this one writes all the raw data
// writingDB.getRawSchedule();
// // this one writes all the games
// writingDB.makeGamesDB();
// writingDB.makePlayerDB();
// writingDB.makePlayerStatsDB();
// writingDB.overallStats();
// writingDB.makeTeamDB();


// //cannot figure out why this isn't working
app.use('/', stats);

app.listen(8080, () => {
    console.log('listening on port 8080');
})
