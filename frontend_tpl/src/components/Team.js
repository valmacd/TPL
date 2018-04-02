import React from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';

class Team extends React.Component {
    constructor(){
        super();
        this.state = {
            gamesPlayed: [],
            teamName: ''
        }
    }

    componentDidMount(){
        this.getGames(this.props.match.params.teamId);
    }
    
    componentWillReceiveProps = (nextProps) => {
        if(this.props.match.params.teamId !== nextProps.match.params.teamId){
        this.getGames(nextProps.match.params.teamId);
        }
    }

    getGames = (teamId) => {
        //console.log(teamId)
        axios.post('http://localhost:8080/games', {teamId: teamId}) 
            .then( gameStats => {
                //console.log(gameStats.data)
                this.setState({
                    teamName: gameStats.data[gameStats.data.length-1]
                })
                let games = gameStats.data.splice((gameStats.data.length-1),1)
                //console.log(gameStats.data)
                this.setState({
                    gamesPlayed: gameStats.data
                })
            })
            .catch( err => {
                console.log(err);
                console.log('error');
            })
    }

    createStatsTable = (stats) => {
        // console.log(stats)
        let rosterList;
        const stat = stats.map((item) => { 
            rosterList = item.roster.map( name => {
                return (
                   <option value={name.playerId}>{name.playerName}</option> 
                )
            }) 
            //console.log(rosterList);
            return (
                <tr>
                    <td>{item.date}</td>
                    <td><Link className="card-title nameLink playerName" to={'/team/' + item.oppTeamName.teamId}>{item.oppTeamName.teamName}</Link></td>
                    <td>{item.score}</td>
                    <td>{item.oppScore}</td>
                    <td>{item.winLose}</td>
                    <td>
                        <div>
                            <select className="form-control-sm rosterSelect" id="exampleFormControlSelect1" onChange={this.moveToPlayer}>
                                <option>Game Roster</option>
                                {rosterList}
                            </select>
                        </div>        
                    </td>  
                </tr>
            )
        });
        return stat;
    } 

    moveToPlayer = (e) => {
        this.props.history.push('/player/'+ e.target.value);
    }

    render(){
        return(
            <div>
                <Link className="card-title nameLink navMenu" to='/stats'>Back to Overall Stats</Link>
                <div className='borderAround'>
                    <h1 className='title'>{this.state.teamName}</h1>
                    <table className="table table-striped table-sm table-light table-hover colorPalette">
                        <thead>
                            <tr className='header'>
                                <th scope="col">Date</th>
                                <th scope="col">Opposing Team</th>
                                <th scope="col">Score</th>
                                <th scope="col">Opposing Score</th>
                                <th scope="col">Result</th>
                                <th scope="col">Roster</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.createStatsTable(this.state.gamesPlayed)}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    };
}

export default Team;