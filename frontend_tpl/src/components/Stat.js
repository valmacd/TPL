import React from 'react';
import axios from 'axios';
import _ from 'underscore';
import {Link} from 'react-router-dom';

class Stat extends React.Component {
    constructor() {
        super();
        this.state = {
            allStats: [],
            sex: [],
            search: '',
            teamNames: []
        }
    }

    componentDidMount = () => {
        this.getStats();
    }

    //sets the state will all the league stats per player per game
    getStats = () => {
        axios.get('http://localhost:8080/stats') 
            .then( allStats => {
                //console.log(allStats.data)
                this.setState({
                    allStats: allStats.data[0],
                    sex: allStats.data[0],
                    teamNames: allStats.data[1]
                })
            })
            .catch( err => {
                console.log(err);
                console.log('error');
            })
    }

    createStatsTable = (stats) => {
        //console.log(stats)

        const stat = stats.map((item) => { 
            return (
                <tr>
                    <td><Link className="card-title nameLink playerName" to={'/player/' + item.playerId}>{item.playerName}</Link></td>
                    <td>{'$'+item.value}</td>
                    <td>{item.goalsTot}</td>
                    <td>{item.assistTot}</td>
                    <td>{item.secondAssistTot}</td>
                    <td>{item.blockTot}</td>
                    <td>{item.throwAwayTot}</td>
                    <td>{item.receiverErrorTot}</td>    
                </tr>
            )
        });
        return stat;
    } 

    updateSearch = (e) => {
        let searchValue = e.target.value;
        //console.log(searchValue)
        this.setState({
            search: searchValue
        })
    }

    formSelector = (e) => {
        let filteredPlayers = this.state.sex.filter( player => {
            return player.playerName.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1;
        })
        return filteredPlayers;  
    }

    eventSelector = (e) => {
        //console.log(e.target.value);
        let event;
        if(e.target.value === 'Value $'){
            event = 'value';
        }
        else if(e.target.value === 'Goals'){
            event = 'goalsTot';
        }
        else if(e.target.value === 'Assists'){
            event = 'assistTot';
        }
        else if(e.target.value === '2nd Assists'){
            event = 'secondAssistTot';
        }
        else if(e.target.value === 'Blocks'){
            event = 'blockTot';
        }
        else if(e.target.value === 'Throwaways'){
            event = 'throwAwayTot';
        }
        else if(e.target.value === 'Drops'){
            event = 'receiverErrorTot';
        }
        let sorted = _.sortBy( this.state.sex, event).reverse();
        //console.log(sorted);
        this.setState({
            sex: sorted
        })
    }

    sexSelector = (e) => {
        if (e.target.value === "All"){
            this.setState({
                sex: this.state.allStats
            })
        }
        else{
            let newNameArray = this.state.allStats.filter( players => {
            return players.gender === e.target.value
            })
            this.setState({
                sex: newNameArray
            })
        }
    }

    teamNames = () => {
        let teams = this.state.teamNames.map( team => {
            return (
                <option>{team.teamName}</option>    
            )
        })
        return teams;
    }

    viewTeam = (e) => {
        let teamId;
        // console.log(e.target.value);
        for(let i=0; i<this.state.teamNames.length; i++){
            if(this.state.teamNames[i].teamName === e.target.value){
                teamId = this.state.teamNames[i].teamId;
                break;
            }
        }
        this.props.history.push('/team/'+ teamId)
    }

    render(){
        let nameList = this.formSelector();
        //console.log(nameList)
        return(
            <div>
                <div className="team">
                    <span>
                    {/* <Link className="card-title nameLink navMenu" to='/stats'>Back to Overall Stats</Link> */}
                    <select className="form-control teamSearch" id="exampleFormControlSelect1" onChange={this.viewTeam}>
                        <option>Teams</option>
                        {this.teamNames()}
                    </select>
                    </span>
                </div>
                <div className='space'>
                </div>
                <div className='borderAround'>
                    <h1 className='title'>Overall Stats</h1>
                    <form> 
                        <div className='form-row'>
                            
                            <div className="form-group col toggles">
                                <label for="exampleFormControlInput1"></label>
                                <input onChange={this.updateSearch} type="text" className="form-control" id="exampleFormControlInput1" placeholder="Name" value={this.state.search}></input>
                            </div>
                            <div className="form-group col">
                                <label for="exampleFormControlSelect1"></label>
                                <select className="form-control toggles" id="exampleFormControlSelect1" onChange={this.eventSelector}>
                                    <option>Event Type</option>
                                    <option>Value $</option>
                                    <option>Goals</option>
                                    <option>Assists</option>
                                    <option>2nd Assists</option>
                                    <option>Blocks</option>
                                    <option>Throwaways</option>
                                    <option>Drops</option>
                                </select>
                            </div>
                            <div className="form-group col toggles">
                                <label for="exampleFormControlSelect1"></label>
                                <select className="form-control" id="exampleFormControlSelect1" onChange={this.sexSelector}>
                                    <option>All</option>
                                    <option>Male</option>
                                    <option>Female</option>
                                </select>
                            </div>
                            {/* <div className="form-group col toggles">
                                <label for="exampleFormControlSelect1"></label>
                                <select className="form-control" id="exampleFormControlSelect1" onChange={this.viewTeam}>
                                    <option>Teams</option>
                                    {this.teamNames()}
                                </select>
                            </div> */}
                        </div>
                    </form>   
                    <table className="table table-striped table-light table-sm table-hover colorPalette ">
                        <thead>
                            <tr className='header'>
                                <th scope="col">Name</th>
                                <th scope="col">Value</th>
                                <th scope="col">Goals</th>
                                <th scope="col">Assists</th>
                                <th scope="col">2nd Assists</th>
                                <th scope="col">Blocks</th>
                                <th scope="col">Throwaway</th>
                                <th scope="col">Drop</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.createStatsTable(nameList)}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    };
}

export default Stat;