'use babel';
import React from 'react';
import ReactDOM from 'react-dom';

export default class Item extends React.Component {
    constructor() {
        super();
        this.state = {
            text: "xd co"
        };
        this.test = this.test.bind(this);
    }
    test() {
        return this.state.text;
    }
    render() {
        return (
            <a href="http://www.facebook.com" className="item">
                <div>wtf</div>
            </a>
        );
    }
}
