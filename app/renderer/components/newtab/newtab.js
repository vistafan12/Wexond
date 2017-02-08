'use babel';
import React from 'react';
import ReactDOM from 'react-dom';
import Bookmarks from './bookmarks.js';
import Item from './item.js';

export default class Newtab extends React.Component {
    constructor() {
        super();
        //binds

        //global properties
        this.state = {
            bookmarks: [{"name":"Facebook", "url":"https://facebook.com"},{"name":"Youtube", "url":"https://youtube.com"},{"name":"Nersent", "url":"https://http://89.38.146.104"},{"name":"Messenger", "url":"https://www.messenger.com"}]
        };
    }
    componentDidMount() {

    }
    render() {
        const listItems = this.state.bookmarks.map((value, index) => <Item data={value} key={index}></Item>);
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

ReactDOM.render(
    <Newtab/>, document.getElementById('app'));
