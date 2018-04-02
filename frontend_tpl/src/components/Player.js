import React from 'react';
import axios from 'axios';
import {Line} from 'react-chartjs-2';
import _ from 'underscore';
import {Link} from 'react-router-dom';


class Player extends React.Component {
    constructor(){
        super();
        this.state = {
            playerStats: [],
            data: {}
        }
    }

    componentWillMount = () => {
        this.getStats();
    }

    //sets the state will all the league stats per player per game
    getStats = () => {
        let player = this.props.match.params.playerId;
        axios.post('http://localhost:8080/player', {playerId: player}) 
            .then( playerStats => {
                //console.log(playerStats.data)
                this.setState({
                    playerStats: playerStats.data
                })
            })
            .catch( err => {
                console.log(err);
                console.log('error');
            })
    }

    createStatsTable = (stats) => {
        //console.log(stats)
        let statsArray=stats.splice(0,1);
        let graph = _.sortBy( stats, function(date) { return date.date; });
        const stat = graph.map((item) => { 
            return (
                <tr>
                    <td>{item.date}</td>
                    <td><Link className="card-title nameLink playerName" to={'/team/' + item.teamName.teamId}>{item.teamName.teamName}</Link></td>
                    <td>{item.goals}</td>
                    <td>{item.assists}</td>
                    <td>{item.secondAssist}</td>
                    <td>{item.block}</td>
                    <td>{item.throwaways}</td>
                    <td>{item.drops}</td> 
                    <td>{item.connectedPass}</td>   
                    <td>{'$' + item.value}</td>   
                </tr>
            )
        });
        return stat;
    } 

    lineGraph = (data) => {
        //console.log(data)
        let graph = _.sortBy( data, function(date) { return date.date; });
        // console.log(graph)
        let colorArray = ['199,21,133', '255,140,0', '220,20,60', '255,192,203', '0,206,209', '30,144,255', '0,0,128', '127,255,0', '46,139,87','255,255,0', '0,255,255', '255,0,255', '66, 244, 188','168, 5, 37','211, 169, 114','219, 226, 86','90, 22, 127','9, 73, 79','207, 162, 232','90, 22, 127','194, 216, 249']
        const graphData = graph.map( (item, index) => {
            return (
                {
                label: item.date,
                fill: false,
                lineTension: 0.1,
                backgroundColor: 'rgba('+colorArray[index]+',0.4)',
                borderColor: 'rgba('+colorArray[index]+',1)',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: 'rgba('+colorArray[index]+',1)',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointRadius: 1,
                pointHitRadius: 10,
                data: [item.goals, item.assists, item.secondAssist, item.block, item.throwaways, item.drops]
                }    
            )
        }) 
    
        let dataobj = {
            labels: ['Goals', 'Assists', '2nd Assists', 'Block', 'Throwaway', 'Drop'],
            datasets: graphData
        }
        return dataobj;
    }

    render(){
        let name = this.state.playerStats ? this.state.playerStats[0]: '';  
        return(
            <div>
                <Link className="card-title nameLink navMenu" to='/stats'>Back to Overall Stats</Link>
                <div className='borderAround'>
                    <h1 className='title'>{name}</h1>
                    <table className="table table-striped table-sm table-hover table-light colorPalette">
                        <thead>
                            <tr className='header'>
                                <th scope="col">Date</th>
                                <th scope="col">Team</th>
                                <th scope="col">Goals</th>
                                <th scope="col">Assists</th>
                                <th scope="col">2nd Assists</th>
                                <th scope="col">Blocks</th>
                                <th scope="col">Throwaway</th>
                                <th scope="col">Drop</th>
                                <th scope="col">Completed Passes</th>
                                <th scope="col">$ per Game</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.createStatsTable(this.state.playerStats)}
                        </tbody>
                    </table>
                    <div className='lineGraph' style={{width: '80%', padding: '20px', marginLeft: '10%'}}>
                        <Line data={this.lineGraph(this.state.playerStats)}
                            options={{
                                legend: {
                                    position: 'right'
                                },
                                scales: {
                                    yAxes: [{
                                    ticks: {
                                        max: this.props.maxY,
                                        min: 0,
                                        stepSize: 1
                                    }
                                    }]
                                },
                                labels: {
                                    fontsize: 16
                                }
                            }}/>
                    </div>
                </div>
            </div>
        )
    };
}

export default Player;