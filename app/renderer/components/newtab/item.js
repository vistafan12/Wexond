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
    render() {
        return (
            <a href="http://www.facebook.com" className="item">
                <div></div>
            </a>
        );
    }
}
