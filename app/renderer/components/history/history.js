'use babel';
import React from 'react';
import ReactDOM from 'react-dom';
import Toolbar from '../materialdesign/toolbar.js';
import ToolbarIcon from '../materialdesign/toolbaricon.js';
import ToolbarItem from '../materialdesign/toolbaritem.js';
import ToolbarTitle from '../materialdesign/toolbartitle.js';

import HistoryCard from './historycard.js';
import FlatButton from '../materialdesign/flatbutton.js';
import {CSSPlugin, TweenMax} from 'gsap';

export default class History extends React.Component {
    constructor() {
        super();
        //binds
        this.toggleToolbar = this.toggleToolbar.bind(this);
        this.resize = this.resize.bind(this);
        this.getHistory = this.getHistory.bind(this);
        this.loadHistory = this.loadHistory.bind(this);
        this.initializeItems = this.initializeItems.bind(this);
        this.cancelSelection = this.cancelSelection.bind(this);
        //global properties
        this.toolbars = [];
        this.cards = [];
        this.state = {
            checkedItems: 0,
            className1: 'history-toolbar-show',
            className2: 'history-toolbar-hide',
            toolbarBackgroundColor: '#03A9F4',
            toolbarColor: '#000',
            historyCards: []
        }
    }

    componentDidMount() {
        this.toggleToolbar(1);
        this.resize();
        window.addEventListener('resize', this.resize);
        this.loadHistory();
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
            this.setState({className1: 'history-toolbar-show', className2: 'history-toolbar-hide', toolbarBackgroundColor: '#03A9F4', toolbarColor: '#000'});
        } else {
            this.setState({className2: 'history-toolbar-show', className1: 'history-toolbar-hide', toolbarBackgroundColor: '#1E88E5', toolbarColor: '#fff'});
        }
    }

    getHistory() {
        return this;
    }

    initializeItems(r) {
        var h = getHistoryData();
        for (var z = 0; z < h.history.length; z++) {
            if (r.props.object.title == h.history[z].date) {
                r.addItem({title: h.history[z].title});
            }
        }
    }

    loadHistory() {
        var h = getHistoryData();
        var headers = [];
        for (var i = 0; i < h.history.length; i++) {
            if (!isInArray(h.history[i].date, headers)) {
                headers.push(h.history[i].date);
            }
        }

        for (var i = 0; i < headers.length; i++) {
            var newState = this.state;
            newState.historyCards.push({title: headers[i]});
            this.setState(newState);
        }
    }

    cancelSelection() {
        for (var x = 0; x < this.cards.length; x++) {
            for (var z = 0; z < this.cards[x].items.length; z++) {

                this.cards[x].items[z].refs.checkbox.unCheck();
            }
        }
        this.setState({checkedItems: 0});
        this.toggleToolbar(1);
    }

    render() {
        this.toolbars = [];
        var opacity = (this.state.toolbarColor == '#fff')
            ? 1
            : 0.9;
        var inverted = (this.state.toolbarColor == '#fff')
            ? true
            : false;
        return (
            <div>
                <Toolbar backgroundColor={this.state.toolbarBackgroundColor} style={{
                    position: 'fixed',
                    zIndex: 9999,
                    top: 0
                }} ref="toolbar">
                    <div className={this.state.className1} id="t1">
                        <ToolbarTitle>History</ToolbarTitle>
                    </div>
                    <div className={this.state.className2} id="t2">
                        <ToolbarIcon onClick={this.cancelSelection} rippleColor={this.state.toolbarColor} inverted={inverted} image="browser/img/tabbar/close.png"></ToolbarIcon>
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
                    {this.state.historyCards.map((object, key) => <HistoryCard ref={(r) => {this.initializeItems(r); this.cards.push(r);}} object={object} key={key} getHistory={this.getHistory}></HistoryCard>)}
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <History/>, document.getElementById('app'));
