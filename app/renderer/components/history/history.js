'use babel';
import React from 'react';
import ReactDOM from 'react-dom';
import Toolbar from '../materialdesign/toolbar.js';
import ToolbarIcon from '../materialdesign/toolbaricon.js';
import ToolbarItem from '../materialdesign/toolbaritem.js';
import MaterialButton from '../materialdesign/materialbutton.js';
import Card from '../materialdesign/card.js';
import {CSSPlugin, TweenMax} from 'gsap';

export default class History extends React.Component {
    constructor() {
        super();
        //binds
        this.onClick = this.onClick.bind(this);
        //global properties

    }

    componentDidMount() {
        this.toggleToolbar(2, 1);
    }

    toggleToolbar(idToShow, idToHide) {
        var t = this;
        this.refs["t" + idToShow].css('display', 'block');
        TweenMax.to(this.refs["t" + idToShow], 0.2, {css:{opacity: 1}});
        TweenMax.to(this.refs["t" + idToHide], 0.2, {css:{opacity: 0}, onComplete: function() {
            t.refs["t" + idToHide].css('display', 'none');
        }});
    }

    onClick() {
        console.log("siema");
        this.toggleToolbar(1, 2);
    }

    render() {
        return (
            <Toolbar title="History" backgroundColor="#03A9F4">
                <div ref="t1" id="1">
                    <ToolbarIcon inverted={true} rippleColor='#fff' image='browser/img/tabbar/close.png'></ToolbarIcon>
                    <ToolbarItem style={{color: '#fff', marginLeft: 20}}>Selected items: 1</ToolbarItem>
                    <ToolbarItem position="right">
                        <MaterialButton rippleColor='#fff' type={1} style={{color: '#fff'}}>DELETE</MaterialButton>
                    </ToolbarItem>
                    <ToolbarItem position="right">
                        <MaterialButton rippleColor='#fff' type={1} style={{color: '#fff'}}>CANCEL</MaterialButton>
                    </ToolbarItem>
                </div>
                <div ref="t2" id="2">

                </div>
            </Toolbar>
        );
    }
}

ReactDOM.render(<History/>, document.getElementById('app'));
