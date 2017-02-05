'use babel';
import React from 'react';
import ReactDOM from 'react-dom';

export default class History extends React.Component {
    constructor() {
        super();
    }
    render() {
        return (
            <div>hello world</div>
        );
    }
}

ReactDOM.render(<History/>, document.getElementById('app'));
