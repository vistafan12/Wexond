'use babel';
import React from 'react';
import ReactDOM from 'react-dom';
import Toolbar from '../materialdesign/toolbar.js';

export default class History extends React.Component {
    constructor() {
        super();
    }
    render() {
        return (
            <Toolbar></Toolbar>
        );
    }
}

ReactDOM.render(<History/>, document.getElementById('app'));
