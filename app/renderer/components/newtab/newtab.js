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
            tcFontColor: "",
            toastText: "Added new card!"
        };
        try {
            if(getNewtabData().length < 2) {
                resetNewtabData();
            } else {
                var _json = getNewtabData();
                for(var i = 0; i < _json.newtabdata.length; i++) {
                    var _item = _json.newtabdata[i];
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
                                t.refs.dialog_additem.hide();
                                t.setState({toastText: "Added new card!"});
                                t.refs.toast.show(function() {
                                    window.location.href = "";
                                });
                            });
                        }
                    }
                }
            }
        }
    }
    _cancel() {
        this.refs.dialog_additem.hide();
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
                <div className="dark" ref="dark" onClick={this._cancel}></div>
                <AddItem ref="additem" getParent={this.getNewtab}></AddItem>
                <Dialog ref="dialog_additem" getParent={this.getNewtab} onOk={this._add} onCancel={this._cancel} ok="ADD" cancel="CANCEL">
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
                <Dialog></Dialog>
                <Toast ref="toast" text={this.state.toastText} hideTime={300}></Toast>
            </div>
        );
    }
}

ReactDOM.render(
    <Newtab/>, document.getElementById('app'));
