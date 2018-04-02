import React from 'react';
import 'antd/dist/antd.css';
import { Collapse } from 'antd';
import { Select } from 'antd';
import { Table } from 'antd';
import axios from 'axios';

const columns = [{
    title: 'Name',
    dataIndex: 'playerName',
    filters: [{
      text: 'Male',
      value: 'male',
    }, {
      text: 'Female',
      value: 'female',
    }],
    render: text => <a href={text}>{text}</a>,
    // specify the condition of filtering result
    // here is that finding the name started with `value`
    onFilter: (value, record) => console.log(record)//record.gender.indexOf(value) === 0
  }, {
    title: 'Goals',
    dataIndex: 'goalsTot',
    defaultSortOrder: 'descend',
    sorter: (a, b) => a.goalsTot - b.goalsTot,
  }, {
    title: 'Assists',
    dataIndex: 'assistTot',
    defaultSortOrder: 'descend',
    sorter: (a, b) => a.assistTot - b.assistTot,
  }, {
    title: '2nd Assists',
    dataIndex: 'secondAssistTot',
    defaultSortOrder: 'descend',
    sorter: (a, b) => a.secondAssistTot - b.secondAssistTot,
  }, {
    title: 'Blocks',
    dataIndex: 'blockTot',
    defaultSortOrder: 'descend',
    sorter: (a, b) => a.blockTot - b.blockTot,
  }, {
    title: 'Thrower Errors',
    dataIndex: 'throwAwayTot',
    defaultSortOrder: 'descend',
    sorter: (a, b) => a.throwAwayTot - b.throwAwayTot,
  },{ 
    title: 'Reveiver Errors',
    dataIndex: 'receiverErrorTot',
    defaultSortOrder: 'descend',
    sorter: (a, b) => a.receiverErrorTot - b.receiverErrorTot
  }];

class Stats extends React.Component {
    constructor() {
        super();
        this.state = {
            allStats: []
        }
    }

    componentDidMount = () => {
        this.getStats();
    }

    //sets the state will all the league stats per player per game
    getStats = () => {
        axios.get('http://localhost:8080/stats') 
            .then( allStats => {
                console.log(allStats.data);
                this.setState({
                    allStats: allStats.data
                })
            })
            .catch( err => {
                console.log(err);
                console.log('error');
            })
    }
    


    render(){
        let onChange = (pagination, filters, sorter) => {
            console.log('params', pagination, filters, sorter);
        }

        return(
            <div>
                <h1>Stats</h1>
                <Table columns={columns} dataSource={this.state.allStats} onChange={onChange} />
            </div>
        )
    };
}

export default Stats;