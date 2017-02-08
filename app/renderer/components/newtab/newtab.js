'use babel';
import React from 'react';
import ReactDOM from 'react-dom';
import Bookmarks from './bookmarks.js';
import Item from './item.js';

export default class Newtab extends React.Component {
    constructor() {
        super();
        this.state = {
            text: "xd co",
            bookmarks: [{"name":"Facebook", "url":"https://facebook.com"},{"name":"Youtube", "url":"https://youtube.com"}]
        };
    }
    componentDidMount() {

    }
    render() {
        const listItems = this.state.bookmarks.map((number, index) => <Item key={index}></Item>);
        return (
            <div>
                <div className="bgizmage">
                    <Bookmarks ref="bookmarks">
                        {listItems}
                    </Bookmarks>
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
