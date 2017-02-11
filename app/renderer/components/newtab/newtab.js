'use babel';
import React from 'react';
import ReactDOM from 'react-dom';
import Cards from './cards.js';
import Item from './item.js';
import AddItem from './additem.js';
import Dialog from './dialog.js';

export default class Newtab extends React.Component {
    constructor() {
        super();
        //binds
        this.getNewtab = this.getNewtab.bind(this);
        //global properties
        this.state = {
            cards: [
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
                 }
            ]
        };
    }
    componentDidMount() {
        try {
            if(getNewtabData().length < 2) {
                //resetNewtabData();
            } else {
                /*newTabAddCard(0, "nersent", "nersent.tk", "cos", "#ff0000", "#fff", function() {
                    newTabAddCard(1, "test", "aha.tk", "wtf", "#ff00ff", "#555", function() {
                        console.log("koniec");
                    });
                });*/
            }/*else {
                //newTabAddCard();
                newTabAddCard(0, "warto wiedzieć");
                newTabAddCard(1, "nersent");
                //newTabRemoveCard(1);
            }*/
        } catch(ex) {
            console.log(ex);
            //resetNewtabData();
        }
    }
    getNewtab() {
        return this;
    }
    render() {
        const listItems = this.state.cards.map((value, index) =>
            <Item
                data={value}
                key={index}
                name={this.state.cards[index].name}
                url={this.state.cards[index].url}
                icon={this.state.cards[index].icon}
                color={this.state.cards[index].color}
                fontColor={this.state.cards[index].fontColor}
                rippleColor={"#fff"}>
            </Item>
        );
        //TODO: inputs
        return (
            <div>
                <div className="bgizmage" ref="bgizmage">
                    <Cards maxInLine={4} ref="cards">
                        {listItems}
                    </Cards>
                </div>
                <div className="dark" ref="dark"></div>
                <AddItem ref="additem" getParent={this.getNewtab}></AddItem>
                <Dialog ref="dialog" getParent={this.getNewtab}>

                </Dialog>
            </div>
        );
    }
}

ReactDOM.render(
    <Newtab/>, document.getElementById('app'));
