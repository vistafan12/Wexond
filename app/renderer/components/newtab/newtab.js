'use babel';
import React from 'react';
import ReactDOM from 'react-dom';

export default class Newtab extends React.Component {
    constructor() {
        super();
        this.state = {
            text: "xd co"
        };
    }
    render() {
        return (
            <div>
                <div className="bgimage">
                    <div className="bookmarks">
                        <a href="http://www.facebook.com" className="bookmark ripple" style={{backgroundColor: "#3b5998"}}>
                          <img className="icon noselectable" src="https://cdn1.iconfinder.com/data/icons/logotypes/32/square-facebook-512.png"/>
                          <div className="title noselectable">Facebook</div>
                        </a>
                    </div>
                </div>
            </div>
        );
    }
}
/*
<div className="bookmarks">
    <a href="http://www.facebook.com" className="bookmark ripple" style={{backgroundColor: "#3b5998"}}>
      <img className="icon noselectable" src="https://cdn1.iconfinder.com/data/icons/logotypes/32/square-facebook-512.png"/>
      <div className="title noselectable">Facebook</div>
    </a>
</div>*/

ReactDOM.render(
    <Newtab/>, document.getElementById('app'));
