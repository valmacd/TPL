import React, { Component } from 'react';
import './App.css';
import {ReactRouter, Switch, Link, Route} from 'react-router-dom';
import Home from './components/Home';
import Player from './components/Player';
import Stat from './components/Stat';
import Team from './components/Team';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Switch>
          <Route path='/'exact render={() => <Home/>}/>
          <Route path='/stats'render={(props) => <Stat match={props.match} history={props.history}/>}/>
          <Route path='/player/:playerId'render={(props) => <Player history={props.history} match={props.match}/>}/>
          <Route path='/team/:teamId'render={(props) => <Team match={props.match} history={props.history}/>}/>
        </Switch>
      </div>
    );
  }
}

export default App;
