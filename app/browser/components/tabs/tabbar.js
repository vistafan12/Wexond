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
            addButtonLeft: 0,
            addButtonVisibility: 'block'
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
        tab.getPage().setState({visible: true});
    }
    _deSelectTab = (tab) => {
        tab.setState({backgroundColor: '#E0E0E0'});
        tab.getPage().setState({visible: false});
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
            a += this.actualTabWidth + 1;
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

        this.actualTabWidth = tabWidthTemp;

        return tabWidthTemp;
    }
    /*
    * gets tab from mouse point
    * @param1 {Tab} callingTab
    * @param2 {Number} cursorX
    * @return {Tab}
    */
    getTabFromMousePoint = (callingTab, xPos) => {
        for (var i = 0; i < tabs.length; i++) {
            if (tabs[i] != callingTab) {
                if (this.contains(tabs[i], xPos)) {
                    if (!tabs[i].locked) {
                        return tabs[i];
                    }
                }
            }
        }
        return null;
    }
    /*
    * checks if {Tab}.refs.tab contains mouse x position
    * @param1 {Tab} tabToCheck
    * @param2 {Number} cursorX
    * @return {Boolean}
    */
    contains = (tabToCheck, xPos) => {
        var rect = tabToCheck.refs.tab.getBoundingClientRect();

        if (xPos >= rect.left && xPos <= rect.right) {
            return true;
        }
        return false;
    }
    /*
    * replaces tabs
    * @param1 {Number} firstIndex
    * @param2 {Number} secondIndex
    * @param3 {Tab} firstTab
    * @param4 {Tab} secondTab
    */
    replaceTabs = (firstIndex, secondIndex, firstTab, secondTab) => {
        tabs[firstIndex] = secondTab;
        tabs[secondIndex] = firstTab;
        this.changePos(secondTab);

        if (tabs.indexOf(firstTab) === 0) {
            firstTab.setState({showLeftBorder: false});
        } else {
            firstTab.setState({showLeftBorder: true});
        }
    }
    /*
   * changes position of tab to its place
   * @param1 {Tab} callingTab
   */
   changePos = (callingTab) => {
       var self = this;
       var data = this.getPositions();
       var newTabPos = data.tabPositions[tabs.indexOf(callingTab)];
       callingTab.setState({left: newTabPos});

       if (newTabPos === 0) {
           callingTab.setState({showLeftBorder: false});
       } else {
           callingTab.setState({showLeftBorder: true});
       }
    }
    /*
    * gets TabBar
    * @return {TabBar}
    */
    getTabBar = () => {
        return this;
    }
    /*
    * gets add tab button
    * @return {DOMElement}
    */
    getAddButton = () => {
        return this.refs.addButton;
    }

    render() {
        var self = this;

        var addButtonStyle = {
            left: this.state.addButtonLeft,
            display: this.state.addButtonVisibility
        };

        return (
            <div className="tabbar" ref="tabbar">
                {
                    this.state.tabsToCreate.map((object, i) => {
                        return <Tab getApp={self.props.getApp} getTabBar={self.getTabBar} key={i} data={object}></Tab>;
                    })
                }
                <div className="tabbar-add" ref="addButton" style={addButtonStyle} onClick={()=> this.addTab()}></div>
            </div>
        );
    }
}
