const Team = require('../models/Team'),
      Game = require('../models/Game'),
      Stat = require('../models/Stat'),
      Player = require('../models/Player'),
      RawEvent = require('../models/RawEvent'),
      RawSchedule = require('../models/RawSchedule'),
      OverallStats = require('../models/OverallStats'),
      axios = require('axios');

let writingDB = {
    getRawSchedule: 
        //this collects all the raw data from the 2 apis and stores it in my own DB under RawSchedule and RawEvent
        function getRawSchedule(){
            axios.get('https://tuc-tpl.herokuapp.com/games/538')
                .then( leagueschedule => {
                    console.log(leagueschedule.data);
                    for (let i=0 ; i<leagueschedule.data.length; i++) {
                        let savedRawSchedule = RawSchedule({
                            gameId: leagueschedule.data[i].id,
                            leagueId: leagueschedule.data[i].leagueId,
                            date: leagueschedule.data[i].date,
                            homeTeam: leagueschedule.data[i].homeTeam,
                            homeTeamId: leagueschedule.data[i].homeTeamId,
                            awayTeam: leagueschedule.data[i].awayTeam,
                            awayTeamId: leagueschedule.data[i].awayTeamId
                        });
                    savedRawSchedule.save()
                        .then( savedSchedule => {
                            console.log(savedSchedule);  
                        })
                        .catch( err => {
                            console.log(err);
                            console.log('error saving to db')
                        });
                    } 
                    writingDB.sortGamesData(leagueschedule);
                })
                .catch( err => {
                    console.log(err);
                    console.log('error with game schedule get requests');
                })
        },
    
    makeTeamDB: 
        //populate the teams db (will only pick the unique ones)
        function makeTeamsDB(){
            RawSchedule.find({})
                .then( teams => {
                    //console.log(teams);
                    for(let i=0; i< teams.length; i++){
                        let savedTeam = Team({teamName: teams[i].homeTeam, teamId: teams[i].homeTeamId} || {teamName: teams[i].awayTeam, teamId: teams[i].awayTeamId});
                        //console.log(savedTeam);
                        savedTeam.save()
                            .then( savedTeam => {
                                console.log(savedTeam);  
                            })
                            .catch( err => {
                                console.log(err);
                                console.log('error saving to db')
                            });
                    }  
                })
                .catch( err => {
                    console.log(err);
                })
        },

    makePlayerDB:
        //populate the players db (will only pick the unique ones)
        function makePlayerDB(){
            RawEvent.find({})
                .then( players => {
                    console.log(players);
                    for(let i=0; i< players.length; i++){
                        let savedPlayer = Player({playerName: players[i].playerName, playerId: players[i].playerId, gender: players[i].gender});
                        //console.log(savedTeam);
                        savedPlayer.save()
                            .then( savePlayer => {
                                console.log(savedPlayer);  
                            })
                            .catch( err => {
                                console.log(err);
                                console.log('error saving to db')
                            });
                    }  
                })
                .catch( err => {
                    console.log(err);
                })
        },
    
    sortGamesData:
        function sortGamesData(leagueschedule) {
            let schedule = leagueschedule.data.reduce( (acc, gamelog) => {
                acc.push({gameId: gamelog.id, teamId: gamelog.homeTeamId, date: gamelog.date})
                acc.push({gameId: gamelog.id, teamId: gamelog.awayTeamId, date: gamelog.date})
                return acc;
            },[]);
            writingDB.getRawEventData(schedule);
        }, 
        
    getRawEventData:
        //this function gets the raw data for the events by using recursion (this is a huge data set ~18000)
        function getRawEventData(schedule, inputStart=0) {
            if(inputStart === schedule.length){
                console.log('all the events are saved to the db');
            }
            else {
                axios.get('https://tuc-tpl.herokuapp.com/gameEvents/'+schedule[inputStart].gameId+'/'+ schedule[inputStart].teamId)
                    .then( gamelog => {
                        //console.log(gamelog.data);
                        let savedRawEvents;
                        for(let i=0; i<gamelog.data.length; i++) { 
                            if(gamelog.data[i].eventType === ''){
                                savedRawEvents = RawEvent({
                                gameId: gamelog.data[i].gameId,
                                teamId: gamelog.data[i].teamId,
                                sequence: gamelog.data[i].sequence,
                                eventType: 'connectedPass',
                                playerId: gamelog.data[i].player.id,
                                playerName: gamelog.data[i].player.playerName,
                                gender: gamelog.data[i].player.gender
                                });    
                            }
                            else {
                                savedRawEvents = RawEvent({
                                gameId: gamelog.data[i].gameId,
                                teamId: gamelog.data[i].teamId,
                                sequence: gamelog.data[i].sequence,
                                eventType: gamelog.data[i].eventType,
                                playerId: gamelog.data[i].player.id,
                                playerName: gamelog.data[i].player.playerName,
                                gender: gamelog.data[i].player.gender
                                }); 
                            }    
                            
                            savedRawEvents.save()
                                .then( savedEvent => {
                                    console.log(savedEvent);  
                                })
                                .catch( err => {
                                    console.log(err);
                                    console.log('error saving to db')
                                });
                        }
                        inputStart ++
                        writingDB.getRawEventData(schedule, inputStart)
                    })
                    .catch( err => {
                        console.log(err);
                        console.log('error');
                    })
            }
        },

    makeGamesDB:
        //get all the gameIds with home and away team and build an array
            //then get team scores per game and roster to create the games db
        function games(){
            gamesArray = [];
            RawSchedule.find({})
                .then( games => {
                    for(let i=0; i<games.length; i++){
                        gamesArray.push({gameId: games[i].gameId, teamId: games[i].homeTeamId, date: games[i].date});
                        gamesArray.push({gameId: games[i].gameId, teamId: games[i].awayTeamId, date: games[i].date});     
                    }
                    //console.log(gamesArray);
                    for(let j=0; j< gamesArray.length; j++){
                        let goals = 0, playerArray = [];
                        RawEvent.find({
                            gameId: {$in: gamesArray[j].gameId},
                            teamId: {$in: gamesArray[j].teamId },
                            eventType: {$in: 'Goal'}  
                        })
                        .then(gameScores => {
                            goals = gameScores.length;
                        })
                        .catch(err => {
                            console.log(err);
                        })
                        RawEvent.find({
                            gameId: {$in: gamesArray[j].gameId},
                            teamId: {$in: gamesArray[j].teamId },
                        })
                        .then( roster => {
                            //console.log(roster);
                            for(let k=0; k<roster.length; k++){
                                if(roster[k].length === 0){
                                    playerArray.push(roster[k].playerId)
                                }
                                else {
                                    let match = false;
                                    for (let a=0; a<playerArray.length; a++){ 
                                        if (roster[k].playerId === playerArray[a]) {
                                            match = true
                                            break;
                                        } 
                                    }    
                                    if(!match){
                                        playerArray.push(roster[k].playerId);
                                    }  
                                }    
                            }
                            let savedGame = Game({
                                gameId: gamesArray[j].gameId, 
                                date: gamesArray[j].date,
                                teamId: gamesArray[j].teamId, 
                                score: goals, 
                                roster: playerArray
                            });
                            savedGame.save()
                            .then( savedGame => {
                                console.log(savedGame);  
                            })
                            .catch( err => {
                                console.log(err);
                                console.log('error saving to db')
                            }); 
                        })
                        .catch(err => {
                            console.log(err);
                        });
                    }
                })
        },

    makePlayerStatsDB:
        //populates the stats per player per game
        function playerStats(){
            Player.find({})
                .then( players => {
                    //console.log(players);
                    for(let i=0; i<players.length; i++){
                        Game.find({ roster: players[i].playerId})
                            .then( gamesPlayed => {
                                for(let j=0;j<gamesPlayed.length; j++){
                                    RawEvent.find({gameId: gamesPlayed[j].gameId, playerId: players[i].playerId})
                                        .then( allEvents => {
                                            //console.log(allEvents);
                                            let goals = 0, assists = 0, secondAssists = 0, receiverErrors = 0, throwAways = 0, block = 0, connectedPass = 0;
                                            for(let k=0; k<allEvents.length; k++){ 
                                                if(allEvents[k].eventType === 'Goal'){
                                                    goals ++
                                                }
                                                else if(allEvents[k].eventType === 'Assist'){
                                                    assists ++
                                                }
                                                else if(allEvents[k].eventType === '2nd Assist'){
                                                    secondAssists ++
                                                }
                                                else if(allEvents[k].eventType === 'TA'){
                                                    throwAways ++
                                                }
                                                else if(allEvents[k].eventType === 'D'){
                                                    block ++
                                                }
                                                else if(allEvents[k].eventType === 'Drop'){
                                                    receiverErrors ++
                                                }
                                                else if(allEvents[k].eventType === 'connectedPass'){
                                                    connectedPass ++
                                                }  
                                            } 
                                            let value = 100000+5000*goals+5000*assists+5000*block+3000*secondAssists-3500*throwAways-3500*receiverErrors;
                                            let stats = {
                                                playerId: players[i].playerId, 
                                                gameId: gamesPlayed[j].gameId, 
                                                goals: goals, 
                                                assist: assists, 
                                                secondAssist: secondAssists, 
                                                throwAway: throwAways, 
                                                receiverError:receiverErrors, 
                                                block: block,
                                                connectedPass: connectedPass
                                            };
                                            // console.log(statArray)
                                            let savedPlayerStats = Stat(stats);
                                            savedPlayerStats.save()
                                                .then( savedStats => {
                                                    console.log(savedStats);  
                                                })
                                                .catch( err => {
                                                    console.log(err);
                                                    console.log('error saving to db')
                                                }); 
                                        })
                                        .catch( err => {
                                            console.log(err);    
                                        })
                                }
                            })
                            .catch( err => {
                                console.log(err);
                            })
                    }
                })
                .catch( err => {
                    console.log(err);
                })
        },
    
    overallStats: 
        function overallStats(){
            Player.find({})
                .then( players => {
                    for (let i=0; i<players.length; i++){
                        Stat.find({
                            playerId: players[i].playerId
                        }) 
                        .then ( playerStats => {
                            let goals = 0, assists = 0, secondAssists = 0, receiverErrors = 0, throwAways = 0, block = 0, connectedPass = 0;
                            for(let j=0; j<playerStats.length; j++){
                                goals += playerStats[j].goals
                                assists += playerStats[j].assist 
                                secondAssists += playerStats[j].secondAssist 
                                throwAways += playerStats[j].throwAway
                                block += playerStats[j].block
                                receiverErrors += playerStats[j].receiverError
                                connectedPass += playerStats[j].connectedPass
                            }  
                            let value = 100000+5000*goals+5000*assists+5000*block+3000*secondAssists-3500*throwAways-3500*receiverErrors;             
                            let statsOverallPlayer = {
                                playerName: players[i].playerName,
                                playerId: players[i].playerId,
                                gender: players[i].gender,
                                gamesPlayed: playerStats.length, 
                                goalsTot: goals, 
                                assistTot: assists, 
                                secondAssistTot: secondAssists, 
                                throwAwayTot: throwAways, 
                                receiverErrorTot:receiverErrors, 
                                blockTot: block,
                                connectedPassTot: connectedPass,
                                value: value
                            };
                            let statsOverall = OverallStats(statsOverallPlayer);
                                statsOverall.save()
                                    .then( allStats => {
                                        console.log(allStats);  
                                    })
                                    .catch( err => {
                                        console.log(err);
                                        console.log('error saving to db')
                                    }); 
                            //console.log(statsOverallPlayer)
                            //statsOverall.push(statsOverallPlayer);
                            
                        })
                        .catch( err => {
                            console.log(err);
                            //res.status(400).json({error});
                        });
                    }
                    
                })
                .catch( err => {
                    console.log(err);
                })
        }
    
}

module.exports = writingDB;