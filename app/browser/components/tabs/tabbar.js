import React from 'react';
import Tab from './tab';
import {TweenMax, CSSPlugin} from "gsap";

import '../../../resources/browser/scss/tabbar.scss';

export default class TabBar extends React.Component {
    constructor() {
        super();

        //global properties
        this.defaultOptions = {
            url: 'wexond://newtab/',
            select: true
        };
        this.state = {
            tabsToCreate: [],
            addButtonLeft: 0
        }
        this.maxTabWidth = 190;
        this.actualTabWidth = this.maxTabWidth;
    }
    componentDidMount() {

    }
    selectTab = (tab) => {
        for (var i = 0; i < tabs.length; i++) {
            if (tabs[i] === tab) {
                this._selectTab(tab);
            } else {
                this._deSelectTab(tabs[i]);
            }
        }
    }
    _selectTab = (tab) => {
        tab.setState({backgroundColor: tab.backgroundColor});
    }
    _deSelectTab = (tab) => {
        tab.setState({backgroundColor: '#E0E0E0'});
    }
    /*
    * adds tab to render queue
    * @param1 {Function} getPage
    */
    addTab = (options = this.defaultOptions) => {
        this.setState((p) => {
            p.tabsToCreate.push(options);
            return {tabsToCreate: p.tabsToCreate};
        });
    }
    /*
    * sets positions for tabs and add button
    * @param1 {Boolean} animateTabs (optional)
    * @param2 {Boolean} animateAddButton (optional)
    */
    setPositions = (animateTabs = false, animateAddButton = false) => {
        var data = this.getPositions();
        var lefts = data.tabPositions;
        var addLeft = data.addButtonPosition;

        for (var i = 0; i < tabs.length; i++) {
            if (animateTabs) {
                //TODO: animate tab position
            } else {
                tabs[i].setState({left: lefts[i]});
            }
        }
        if (animateAddButton) {
            //TODO: animate add tab button position
        } else {
            this.setState({addButtonLeft: addLeft});
        }
    }
    /*
    * sets widths for all tabs
    * @param1 {Boolean} animation
    */
    setWidths = (animation = false) => {
        var tempWidth = this.getWidths();

        for (var i = 0; i < tabs.length; i++) {
            if (animation) {
                //TODO: animate tab width
            } else {
                tabs[i].setState({width: tempWidth});
            }
        }
    }
    /*
    * calculates positions for all tabs and add button
    * @return {Object}
    */
    getPositions = () => {
        var tabCountTemp = 0;
        var lefts = [];
        var a = 0;

        for (var i = 0; i < tabs.length; i++) {
            lefts.push(a);
            a += this.actualTabWidth;
        }

        return {tabPositions: lefts, addButtonPosition: a};
    }
    /*
    * calculates widths for all tabs
    * @return {Number}
    */
    getWidths = () => {
        var tabbarWidth = this.refs.tabbar.clientWidth;
        var addButtonWidth = this.refs.addButton.offsetWidth;
        var tabWidthTemp = 0;

        for (var i = 0; i < tabs.length; i++) {
            var tabWidthTemp = (tabbarWidth - addButtonWidth - 2) / tabs.length;
            if (tabWidthTemp > this.maxTabWidth) {
                tabWidthTemp = this.maxTabWidth;
            }
        }

        console.log(tabWidthTemp);

        this.actualTabWidth = tabWidthTemp;

        return tabWidthTemp;
    }
    /*
    * gets TabBar
    * @return {TabBar}
    */
    getTabBar = () => {
        return this;
    }

    render() {
        var self = this;

        var addButtonStyle = {
            left: this.state.addButtonLeft
        };

        return (
            <div className="tabbar" ref="tabbar">
                {
                    this.state.tabsToCreate.map((object, i) => {
                        return <Tab getTabBar={self.getTabBar} key={i} data={object}></Tab>;
                    })
                }
                <div className="tabbar-add" ref="addButton" style={addButtonStyle} onClick={()=> this.addTab()}></div>
            </div>
        );
    }
}
