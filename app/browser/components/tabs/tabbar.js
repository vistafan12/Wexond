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
        this.lastSelectedTab = null;
        this.timer = {
            time: 0,
            canReset: false
        }
        this.nextPinnedTabIndex = 0;
        this.widths = [];
    }

    componentDidMount() {
        var self = this;
        this.timer.timer = setInterval(function() {
            if (self.timer.time >= 3) {
                if (self.timer.canReset) {
                    self.setWidths();
                    self.setPositions();
                    self.timer.canReset = false;
                }
                self.timer.time = 0;
            }
            self.timer.time += 1;
        }, 1000);
    }

    /*
    * selects tab and deselects others
    * @param1 {Tab} tab
    */
    selectTab = (tab) => {
        for (var i = 0; i < tabs.length; i++) {
            if (tabs[i] === tab) {
                this._selectTab(tab);
            } else {
                this._deSelectTab(tabs[i]);
            }
        }
    }
    /*
    * selects tab
    * @param1 {Tab} tab
    */
    _selectTab = (tab) => {
        tab.setState({backgroundColor: tab.backgroundColor});
        tab.getPage().setState({visible: true});
        tab.selected = true;
    }
    /*
    * deselects tab
    * @param1 {Tab} tab
    */
    _deSelectTab = (tab) => {
        if (tab.selected) {
            this.lastSelectedTab = tab;
        }
        tab.setState({backgroundColor: '#E0E0E0'});
        tab.getPage().setState({visible: false});
        tab.selected = false;
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
    * closes tab
    * @param1 {Tab} tab
    */
    closeTab = (tab) => {
        if (this.lastSelectedTab == tab) {
            this.lastSelectedTab = null;
        }

        tab.getPage().setState({render: false});
        tab.setState({render: false});

        this.timer.canReset = true;

        var index = tabs.indexOf(tab);
        var nextTab = tabs[index + 1];
        var prevTab = tabs[index - 1];
        tabs.splice(index, 1);

        if (nextTab != null) {
            this.selectTab(nextTab);
        } else {
            if (this.lastSelectedTab != null) {
                this.selectTab(this.lastSelectedTab);
            } else {
                if (prevTab != null) {
                    this.selectTab(prevTab);
                } else {
                    if (tabs[0] != null) {
                        this.selectTab(tabs[0]);
                    }
                }
            }
        }

        if (index == tabs.length) {
            this.setWidths();
            this.setPositions();
        }

        this.timer.time = 0;
        this.setPositions();
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
        var widths = this.getWidths(1);

        for (var i = 0; i < tabs.length; i++) {
            if (animation) {
                //TODO: animate tab width
            } else {
                tabs[i].setState({width: widths[i]});
                tabs[i].width = widths[i];
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
            a += tabs[i].width + 1;
        }

        return {tabPositions: lefts, addButtonPosition: a};
    }
    /*
    * calculates widths for all tabs
    * @return {Number}
    */
    getWidths = (margin = 0) => {
        var tabbarWidth = this.refs.tabbar.clientWidth;
        var addButtonWidth = this.refs.addButton.offsetWidth;
        var tabWidthsTemp = [];
        var tabWidths = [];
        var pinnedTabsLength = 0;

        for (var i = 0; i < tabs.length; i++) {
            if (tabs[i].pinned) {
                tabWidthsTemp.push({id: i, width: tabsData.pinnedTabWidth});
                pinnedTabsLength += 1;
            }
        }

        for (var i = 0; i < tabs.length; i++) {
            if (!tabs[i].pinned) {
                var margins = tabs.length * margin;
                var pinnedTabsWidth = (pinnedTabsLength * tabsData.pinnedTabWidth);
                var tabWidthTemp = (tabbarWidth - addButtonWidth - margins - pinnedTabsWidth) / (tabs.length - pinnedTabsLength);
                if (tabWidthTemp > tabsData.maxTabWidth) {
                    tabWidthTemp = tabsData.maxTabWidth;
                }
                tabWidthsTemp.push({id: i, width: tabWidthTemp});
            }
        }

        for (var i = 0; i < tabWidthsTemp.length; i++) {
            tabWidths[tabWidthsTemp[i].id] = tabWidthsTemp[i].width;
        }

        return tabWidths;
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
    * @param3 {Boolean} changePos (optional)
    */
    replaceTabs = (firstIndex, secondIndex, changePos = true) => {
        var firstTab = tabs[firstIndex];
        var secondTab = tabs[secondIndex];
        tabs[firstIndex] = secondTab;
        tabs[secondIndex] = firstTab;

        if (changePos) {
            this.changePos(secondTab);
        }

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
