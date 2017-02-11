'use babel';
import React from 'react';
import ReactDOM from 'react-dom';
import Cards from './cards.js';
import Item from './item.js';
import AddItem from './additem.js';
import Dialog from './dialog.js';
import Toast from './toast.js';

export default class Newtab extends React.Component {
    constructor() {
        super();
        //binds
        this.getNewtab = this.getNewtab.bind(this);
        this._add = this._add.bind(this);
        this._cancel = this._cancel.bind(this);
        this._update = this._update.bind(this);
        //global properties
        this.state = {
            cards: [

            ],
                tcName:"",
                tcUrl:"",
                tcIcon: "",
                tcColor: "",
                tcFontColor: ""
        };
        try {
            if(getNewtabData().length < 2) {
                resetNewtabData();
            } else {
                var _json = getNewtabData();
                for(var i = 0; i < _json.newtabdata.length; i++) {
                    this.state.cards.push(_json.newtabdata[i]);
                }
            }
        } catch(ex) {
            console.log(ex);
            resetNewtabData();
        }
    }
    componentDidMount() {

    }
    _add() {
        var t = this;
        var _title = this.refs.title.value,
        _url = this.refs.url.value,
        _icon = this.refs.icon.value,
        _color = this.refs.color.value,
        _fontcolor = this.refs.fontcolor.value;
         if (_title.length > 0) {
            if (_url.length > 0) {
                if (_icon.length > 0) {
                    if (_color.length > 0) {
                        if (_fontcolor.length > 0) {
                            newTabAddCard(_title, _url, _icon, _color, _fontcolor, function() {
                                t.refs.dialog.hide();
                                t.refs.toast.show();
                            });
                        }
                    }
                }
            }
        }
    }
    _cancel() {
        this.refs.dialog.hide();
        this.refs.additem.setState({active: false});
        this.refs.additem.setState({imgRotate: 'rotate(0deg)'});
        this.refs.title.value = null;
        this.refs.url.value = null;
        this.refs.icon.value = null;
    }
    _update() {
        var _title = this.refs.title.value,
        _icon = this.refs.icon.value,
        _color = this.refs.color.value,
        _fontcolor = this.refs.fontcolor.value;
        this.setState({tcName: _title});
        this.setState({tcIcon: _icon});
        this.setState({tcColor: _color});
        this.setState({tcFontColor: _fontcolor});
    }
    getNewtab() {
        return this;
    }
    render() {
        console.log(this.state.cards);
        const listItems = this.state.cards.map((value, index) =>
            <Item
                data={value}
                key={index}
                name={this.state.cards[index].name}
                url={this.state.cards[index].url}
                icon={this.state.cards[index].icon}
                color={this.state.cards[index].color}
                fontColor={this.state.cards[index].fontColor}
                rippleColor={this.state.cards[index].rippleColor}>
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
                <div className="dark" ref="dark" onClick={this._cancel}></div>
                <AddItem ref="additem" getParent={this.getNewtab}></AddItem>
                <Dialog ref="dialog" getParent={this.getNewtab} onOk={this._add} onCancel={this._cancel} ok="ADD" cancel="CANCEL">
                    <input type="text" className="testinput" ref="title" placeholder="Title" onKeyUp={this._update}/>
                    <br /><br />
                    <input type="text" className="testinput" ref="url" placeholder="Url"></input>
                    <br /><br />
                    <input type="text" className="testinput" ref="icon" placeholder="Icon" onKeyUp={this._update}></input>
                    <br /><br />
                    <input type="text" className="testinput" ref="color" placeholder="Background color (HEX)" onKeyUp={this._update}></input>
                    <br /><br />
                    <input type="text" className="testinput" ref="fontcolor" placeholder="Font color (HEX)" onKeyUp={this._update}></input>
                    <div ref="root" className="card-item card-item-test" style={{backgroundColor: this.state.tcColor, color: this.state.tcFontColor}}>
                        <img className="icon noselectable" src={this.state.tcIcon}/>
                        <div className="title noselectable">{this.state.tcName}</div>
                    </div>
                </Dialog>
                <Toast ref="toast" text="Added card!"></Toast>
            </div>
        );
    }
}

ReactDOM.render(
    <Newtab/>, document.getElementById('app'));
