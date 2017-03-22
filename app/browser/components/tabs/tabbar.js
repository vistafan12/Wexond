import React from 'react';
import Tab from './tab';
import {Motion, spring} from 'react-motion';

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
            isAddButtonVisible: true
        }
        this.lastSelectedTab = null;
        this.timer = {
            time: 0,
            canReset: false
        }
        this.nextPinnedTabIndex = 0;
        this.dragData = {};
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

        window.addEventListener('resize', this.onResize);
        window.addEventListener('mousemove', this.onMouseMove);
        window.addEventListener('mouseup', this.onMouseUp);
    }
    /*
    events
    */
    onResize = () => {
        this.setWidths();
        this.setPositions();
    }

    onMouseMove = (e) => {
        if (this.dragData.canDrag) {
            this.dragData.tab.setState({
                left: this.dragData.tabX + e.clientX - this.dragData.mouseClickX
            });
            this.dragData.tab.reorderTabs(e.clientX);
        }
    }

    onMouseUp = () => {
        this.dragData.canDrag = false;
        this.setPositions();
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
        tab.setState({backgroundColor: tab.backgroundColor, selected: true});
        tab.getPage().setState({visible: true});
        tab.selected = true;
        if (tabs[tabs.indexOf(tab) - 1] != null) {
            tabs[tabs.indexOf(tab) - 1].setState({isRightBorderVisible: true});
        }
    }
    /*
    * deselects tab
    * @param1 {Tab} tab
    */
    _deSelectTab = (tab) => {
        if (tab.selected) {
            this.lastSelectedTab = tab;
        }
        tab.setState({backgroundColor: '#E0E0E0', selected: false});
        tab.getPage().setState({visible: false});
        tab.selected = false;
        if (tabs[tabs.indexOf(tab) - 1] != null) {
            tabs[tabs.indexOf(tab) - 1].setState({isRightBorderVisible: false});
        }
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

            if (tab.width < 190) {
                tab.setState({render: false});
            } else {
                closeAnim();
            }
        }  else {
            closeAnim();
        }

        function closeAnim() {
            tab.setState({width: spring(0, tabsAnimationsData.closeTabSpring)});

            var timeout = setTimeout(function() {
                tab.setState({render: false});
                clearTimeout(timeout);
            }, 300);
        }

        this.timer.time = 0;
        this.setPositions();
    }
    /*
    * sets positions for tabs and add button
    * @param1 {Boolean} animateTabs (optional)
    * @param2 {Boolean} animateAddButton (optional)
    */
    setPositions = (animateTabs = true, animateAddButton = true) => {
        var data = this.getPositions();
        var lefts = data.tabPositions;
        var addLeft = data.addButtonPosition;

        for (var i = 0; i < tabs.length; i++) {
            if (animateTabs) {
                tabs[i].setState({
                    left: spring(lefts[i], tabsAnimationsData.setPositionsSpring)
                });
            }
        }
        if (animateAddButton) {
            this.setState({addButtonLeft: spring(addLeft, tabsAnimationsData.setPositionsSpring)});
        }
    }
    /*
    * sets widths for all tabs
    * @param1 {Boolean} animation
    */
    setWidths = (animation = true) => {
        var widths = this.getWidths(1);

        for (var i = 0; i < tabs.length; i++) {
            if (animation) {
                tabs[i].setState({
                    width: spring(widths[i], tabsAnimationsData.setWidthsSpring)
                });
            } else {
                tabs[i].setState({width: widths[i]});
            }
            tabs[i].width = widths[i];
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
        var addButtonWidth = this.addButton.offsetWidth;
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
        var rect = tabToCheck.tab.getBoundingClientRect();

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

        if (tabs.indexOf(firstTab) === 0) {
            firstTab.setState({showLeftBorder: false});
        } else {
            firstTab.setState({showLeftBorder: true});
        }

        if (changePos) {
            this.changePos(secondTab);
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
        callingTab.setState({left: spring(newTabPos, tabsAnimationsData.setPositionsSpring)});

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

        return (
            <div className="tabbar" ref="tabbar">
                {this.state.tabsToCreate.map((object, i) => {
                    return <Tab getApp={self.props.getApp} getTabBar={self.getTabBar} key={i} data={object}></Tab>;
                })}
                <Motion style={{
                    x: this.state.addButtonLeft
                }}>
                    {value => <div className="tabbar-add" ref={(addButton) => this.addButton = addButton} style={{
                        display: (this.state.isAddButtonVisible)
                            ? 'block'
                            : 'none',
                        left: value.x
                    }} onClick={() => this.addTab()}></div>}
                </Motion>
            </div>
        );
    }
}
