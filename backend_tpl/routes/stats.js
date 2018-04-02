const express = require ("express"),
      router = express.Router(),
      _ = require('underscore');

const Team = require('../models/Team'),
      Game = require('../models/Game'),
      Stat = require('../models/Stat'),
      Player = require('../models/Player'),
      RawEvent = require('../models/RawEvent'),
      RawSchedule = require('../models/RawSchedule'),
      OverallStats = require('../models/OverallStats');

router.post('/games', (req, res) => {
    let teamsArray = [], gameScores = [], allGamesPlayed = [], playerArray = [], teamId = req.body.teamId, teamName;
    //console.log(req.body.teamId);
    Promise.all([
        Game.find({teamId: req.body.teamId}),
        Player.find({}),
        Team.find({})   
    ])
    .then( games => {
        
        playerArray = games[1];
        teamsArray = games[2];
        //console.log(teamsArray)
        for(let i=0; i< teamsArray.length; i++){
            if(Number(teamId) === teamsArray[i].teamId){
                teamName = teamsArray[i].teamName
            }    
        }
        allGamesPlayed.push(teamName);
        let allgames = games[0].map( allgames => Game.find({gameId: allgames.gameId}));
        return Promise.all(allgames);
    })
    .then( allgames => {
        //console.log(allgames)
        for(let i=0; i<allgames.length; i++){
            let game = allgames[i];
            let date, score, roster = [], oppScore, oppTeamName, winLose;
            for(let j=0; j<game.length; j++){
                let gameTeam = game[j];
                if(gameTeam.teamId === req.body.teamId){
                    let dt = new Date(gameTeam.date);
                    let day, month;
                    if(dt.getDate() < 10){
                        day = "0"+dt.getDate();
                        month = "0" + (dt.getMonth() + 1);
                    }
                    else {
                        day = dt.getDate();
                        month = (dt.getMonth() + 1);
                    };
                    if(dt.getMonth() < 10){
                        month = "0" + (dt.getMonth() + 1);
                    }
                    else {
                        month = (dt.getMonth() + 1);
                    };
                    date = dt.getFullYear() + "-" + month + "-" + day;
                    score = gameTeam.score;
                    for(let k=0; k < gameTeam.roster.length; k++){
                        for(let a=0; a < playerArray.length; a++){
                            if(gameTeam.roster[k] === playerArray[a].playerId){
                                roster.push({playerId: gameTeam.roster[k], playerName: playerArray[a].playerName});
                            }    
                        }
                        
                    }
                }
                else {
                    oppScore = game[j].score;
                    for(let k=0; k<teamsArray.length; k++){
                        if(teamsArray[k].teamId === Number(game[j].teamId)){
                            oppTeamName = {teamName: teamsArray[k].teamName, teamId: teamsArray[k].teamId};
                            break;
                        }
                    }
                } 
            }
            if(score > oppScore){
                winLose = 'Win'
            }
            else if (score === oppScore) {
                winLose = 'Tie'
            }
            else {
                winLose = 'Loss'
            }
            allGamesPlayed.push({
                date:date, 
                score:score, 
                roster:roster, 
                oppScore:oppScore, 
                oppTeamName:oppTeamName, 
                winLose: winLose
            });
        }
        //console.log(allGamesPlayed);
        let sorted = _.sortBy( allGamesPlayed, function(date) { return date.date; });
        //console.log(sorted);
        res.json(sorted);
    })
    .catch( err => {
        console.log(err);
    })
})

router.get('/stats', (req, res) => {
    Promise.all([
        OverallStats.find({}),
        Team.find({})    
    ])
    .then( allstats => {
        //console.log(allstats)
        res.json(allstats);    
    })   
    .catch( err => {
        console.log(err);
    }) 
});

router.post('/player', (req, res) => {
    let playerStats = [], playerName= '', gameDates = [], teamNames = []; 
    //console.log(req.body)
    return Promise.all([
        Stat.find({playerId: req.body.playerId}),
        Player.find({playerId: req.body.playerId})
    ])
    .then( results => {
        // console.log(results);
        playerStats = results[0];
        playerName = results[1];
        let gameArray = results[0].map(stat=> Game.findOne({gameId: stat.gameId, roster: stat.playerId}))
        return Promise.all(gameArray)   
    })
    .then( resolvedGames => {
        // console.log(resolvedGames);
        gameDates = resolvedGames;
        let team = resolvedGames.map(game=> Team.findOne({teamId: game.teamId}))
        return Promise.all(team) 
    })
    .then( games => {
        teamNames = games;
        let playerStatsArray = [playerName[0].playerName], date = '', teamname = '';
        for(let i=0; i<playerStats.length; i++){
            for(let j=0; j<gameDates.length; j++){
                if(gameDates[j].gameId === playerStats[i].gameId){
                    let dt = new Date(gameDates[j].date);
                    let day, month;
                    if(dt.getDate() < 10){
                        day = "0"+dt.getDate();
                        month = "0" + (dt.getMonth() + 1);
                    }
                    else {
                        day = dt.getDate();
                        month = (dt.getMonth() + 1);
                    };
                    if(dt.getMonth() < 10){
                        month = "0" + (dt.getMonth() + 1);
                    }
                    else {
                        month = (dt.getMonth() + 1);
                    };
                    date = dt.getFullYear() + "-" + month + "-" + day;
                    for(let k=0; k<teamNames.length;k++){
                        if(Number(gameDates[j].teamId) === teamNames[k].teamId){
                            teamname={teamName: teamNames[k].teamName, teamId: teamNames[k].teamId};
                            break;
                        }
                    }
                    break; 
                }   
            } 
            playerStatsArray.push({
                date: date, 
                teamName: teamname, 
                goals: playerStats[i].goals, 
                assists: playerStats[i].assist, 
                secondAssist: playerStats[i].secondAssist, 
                throwaways: playerStats[i].throwAway, 
                drops: playerStats[i].receiverError,
                block: playerStats[i].block, 
                connectedPass: playerStats[i].connectedPass,
                value: 5000*playerStats[i].goals+5000*playerStats[i].assist+5000*playerStats[i].block+3000*playerStats[i].secondAssist-3500*playerStats[i].throwAway-3500*playerStats[i].receiverError
            })
        }
        //console.log(playerStatsArray)
        res.json(playerStatsArray);
    })
    .catch( err => {
        console.log(err);
    })
    
});

module.exports = router;