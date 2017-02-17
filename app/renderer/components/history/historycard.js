'use babel';
import React from 'react';
import Item from './item.js';
import Card from '../materialdesign/card.js';

export default class HistoryCard extends React.Component {
    constructor() {
        super();
        //binds
        this.addItem = this.addItem.bind(this);
        //global properties
        this.items = [];
        this.state = {
            items: []
        }
    }
    componentDidMount() {

    }

    addItem(object) {
        var newState = this.state;
        newState.items.push(object);
        this.setState(newState);
    }

    render() {
        return (
            <div>
                <Card header={this.props.object.title} className="history-card">
                    {this.state.items.map((object, key) => <Item ref={(r)=> this.items.push(r)} object={object} key={key} getHistory={this.props.getHistory}></Item>)}
                </Card>
            </div>
        );
    }
}
