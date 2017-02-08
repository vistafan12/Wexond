'use babel';
import React from 'react';
import ReactDOM from 'react-dom';
import Bookmarks from './bookmarks.js';
import Item from './item.js';
import AddItem from './additem.js';

export default class Newtab extends React.Component {
    constructor() {
        super();
        //binds

        //global properties
        this.state = {
            bookmarks: [
                {
                    "name":"Facebook",
                     "url":"https://facebook.com",
                     "icon": "https://cdn1.iconfinder.com/data/icons/logotypes/32/square-facebook-512.png",
                     "color": "#3b5998",
                     "fontColor": "#fff"
                 },
                 {
                     "name":"Youtube",
                     "url":"https://youtube.com",
                     "icon": "https://cdn3.iconfinder.com/data/icons/social-icons-5/607/YouTube_Play.png",
                     "color": "#c12025",
                     "fontColor": "#fff"
                 },
                 {
                     "name":"Nersent",
                      "url":"http://89.38.146.104",
                      "icon": "http://89.38.146.104/img/nersent.png",
                      "color": "#3f51b5",
                      "fontColor": "#fff"
                  },
                  {
                     "name":"Messenger",
                     "url":"https://www.messenger.com",
                     "icon": "https://lh5.ggpht.com/0VYAvZLR9YhosF-thqm8xl8EWsCfrEY_uk2og2f59K8IOx5TfPsXjFVwxaHVnUbuEjc=w300",
                     "color": "#0084ff",
                     "fontColor": "#fff"
                 },
                 {
                    "name":"HERE COME DAT BOI SHIT WADDUP",
                    "url":"https://www.youtube.com/watch?v=pCOb6Fykxz0",
                    "icon": "https://reductress.com/wp-content/uploads/2016/06/dat-boi-frog-820x500.jpg",
                    "color": "#009300",
                    "fontColor": "#fff"
                }
            ]
        };
    }
    componentDidMount() {

    }
    render() {
        const listItems = this.state.bookmarks.map((value, index) =>
            <Item
                data={value}
                key={index}
                name={this.state.bookmarks[index].name}
                url={this.state.bookmarks[index].url}
                icon={this.state.bookmarks[index].icon}
                color={this.state.bookmarks[index].color}
                fontColor={this.state.bookmarks[index].fontColor}>
            </Item>
        );

        return (
            <div>
                <div className="bgizmage">
                    <Bookmarks maxInLine={4} ref="bookmarks">
                        {listItems}
                    </Bookmarks>
                </div>
                <AddItem></AddItem>
            </div>
        );
    }
}

ReactDOM.render(
    <Newtab/>, document.getElementById('app'));
