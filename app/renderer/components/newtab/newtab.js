'use babel';
import React from 'react';
import ReactDOM from 'react-dom';
import Cards from './cards.js';
import Item from './item.js';

export default class Newtab extends React.Component {
    constructor() {
        super();
        //binds
        this.getNewtab = this.getNewtab.bind(this);
        //global properties
        this.state = {
            cards: [

            ],
            tcName:"",
            tcUrl:"",
            tcIcon: "",
            tcColor: "",
            tcFontColor: "",
            toastText: "Added new card!"
        };
        try {
            if(getNewtabData().length < 2) {
                resetNewtabData();
            } else {
                var _json = getNewtabData();
                for(var i = 0; i < _json.bookmarks.length; i++) {
                    var _item = _json.bookmarks[i];
                    _item.index = i;
                    this.state.cards.push(_item);
                }
            }
        } catch(ex) {
            console.log(ex);
            resetNewtabData();
        }
    }
    componentDidMount() {

    }

    getNewtab() {
        return this;
    }
    _fabclick() {
        this.refs.dialog_settings.show();
    }
    render() {
        const listItems = this.state.cards.map((value, _index) =>
            <Item
                data={value}
                key={_index}
                name={this.state.cards[_index].name}
                url={this.state.cards[_index].url}
                icon={this.state.cards[_index].icon}
                color={this.state.cards[_index].color}
                fontColor={this.state.cards[_index].fontColor}
                rippleColor={this.state.cards[_index].rippleColor}
                index={this.state.cards[_index].index}>
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
            </div>
        );
    }
}

ReactDOM.render(
    <Newtab/>, document.getElementById('app'));
