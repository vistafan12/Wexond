'use babel';
import React from 'react';
import ReactDOM from 'react-dom';
import Toolbar from '../materialdesign/toolbar.js';
import ToolbarIcon from '../materialdesign/toolbaricon.js';
import ToolbarItem from '../materialdesign/toolbaritem.js';
import ToolbarTitle from '../materialdesign/toolbartitle.js';

import Item from './item.js';
import FlatButton from '../materialdesign/flatbutton.js';
import Card from '../materialdesign/card.js';
import {CSSPlugin, TweenMax} from 'gsap';

export default class History extends React.Component {
    constructor() {
        super();
        //binds
        this.toggleToolbar = this.toggleToolbar.bind(this);
        this.resize = this.resize.bind(this);
        this.getHistory = this.getHistory.bind(this);
        //global properties
        this.toolbars = [];
        this.cards = [];
        this.state = {
            checkedItems: 0,
            className1: 'history-toolbar-show',
            className2: 'history-toolbar-hide',
            toolbarBackgroundColor: '#03A9F4',
            toolbarColor: '#000'
        }
    }

    componentDidMount() {
        this.toggleToolbar(1);
        this.resize();
        window.addEventListener('resize', this.resize);
    }

    resize() {
        if (window.innerWidth > 1024 + 32) {
            this.refs.cardsContainer.classList.add('history-cards-container-center');
            this.refs.cardsContainer.classList.remove('history-cards-container-normal');
        } else {
            this.refs.cardsContainer.classList.remove('history-cards-container-center');
            this.refs.cardsContainer.classList.add('history-cards-container-normal');
        }
    }

    toggleToolbar(show) {
        if (show == 1) {
            this.setState({
                className1: 'history-toolbar-show',
                className2: 'history-toolbar-hide',
                toolbarBackgroundColor: '#03A9F4',
                toolbarColor: '#000'
            });
        } else {
            this.setState({
                className2: 'history-toolbar-show',
                className1: 'history-toolbar-hide',
                toolbarBackgroundColor: '#1E88E5',
                toolbarColor: '#fff'
            });
        }
    }

    getHistory() {
        return this;
    }

    render() {
        this.toolbars = [];
        var opacity = (this.state.toolbarColor == '#fff') ? 1 : 0.9;
        var inverted = (this.state.toolbarColor == '#fff') ? true : false;
        return (
            <div>
                <Toolbar backgroundColor={this.state.toolbarBackgroundColor} style={{position: 'fixed', zIndex: 9999, top:0}} ref="toolbar">
                    <div className={this.state.className1} id="t1">
                        <ToolbarTitle>History</ToolbarTitle>
                    </div>
                    <div className={this.state.className2} id="t2">
                        <ToolbarIcon rippleColor={this.state.toolbarColor} inverted={inverted} image="browser/img/tabbar/close.png"></ToolbarIcon>
                        <ToolbarItem color={this.state.toolbarColor} opacity={opacity} marginLeft={16}>Selected items: {this.state.checkedItems}</ToolbarItem>
                        <ToolbarItem position="right">
                            <FlatButton textOpacity={opacity} rippleColor={this.state.toolbarColor} color={this.state.toolbarColor}>
                                DELETE
                            </FlatButton>
                        </ToolbarItem>
                        <ToolbarItem position="right">
                            <FlatButton textOpacity={opacity} rippleColor={this.state.toolbarColor} color={this.state.toolbarColor}>
                                CANCEL
                            </FlatButton>
                        </ToolbarItem>
                    </div>
                </Toolbar>
                <div ref="cardsContainer" className="history-cards-container">
                    <Card ref={(r)=>this.cards.push(r)} className="history-card" header="History">
                        <Item getHistory={this.getHistory}></Item>
                    </Card>
                </div>
            </div>
        );
    }
}

ReactDOM.render(<History/>, document.getElementById('app'));
