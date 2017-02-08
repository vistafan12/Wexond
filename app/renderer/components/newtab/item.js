'use babel';
import React from 'react';
import ReactDOM from 'react-dom';

export default class Item extends React.Component {
    constructor() {
        super();
        //binds

        //global properties
        this.state = {
        };
    }
    componentDidMount() {

    }
    render() {
        return (
            <a href={this.props.url} className="item" style={{backgroundColor: this.props.color, color: this.props.fontColor}}>
                <img className="icon noselectable" src={this.props.icon} />
                <div className="title noselectable">{this.props.name}</div>
            </a>
        );
    }
}
