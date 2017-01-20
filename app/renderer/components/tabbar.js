'use babel';
import React from 'react';
import Tab from './tab.js';
import Colors from '../../classes/colors.js';

export default class TabBar extends React.Component {
    constructor() {
        super();
        //binds
        this.selectTab = this.selectTab.bind(this);
        this.selectTabByIndex = this.selectTabByIndex.bind(this);
        this.removeTab = this.removeTab.bind(this);
        this.calcWidths = this.calcWidths.bind(this);
        this.calcPositions = this.calcPositions.bind(this);
        this.changePos = this.changePos.bind(this);
        this.getTabFromMousePoint = this.getTabFromMousePoint.bind(this);
        this.replaceTabs = this.replaceTabs.bind(this);
        this.getWidths = this.getWidths.bind(this);
        this.getTabBar = this.getTabBar.bind(this);
        this._selectTab = this._selectTab.bind(this);
        this._deselectTab = this._deselectTab.bind(this);
        //global properties
        this.maxTabWidth = 190;
        this.actualTabWidth = this.maxTabWidth;
        this.animationDuration = 150;
        this.canReset = false;
        this.timer = 0;
        this.animationEasing = 'easeOutCirc';
    }
    /*
    events
    */
    addTabClick(self) {
        self.props.getApp().addPage();
    }
    /*
    lifecycle
    */
    componentDidMount() {
        var t = this;
        window.addEventListener('resize', function() {
            t.calcWidths();
            t.calcPositions();
        });
        setInterval(function() {
            if (t.timer >= 3) {
                if (t.canReset) {
                    t.calcWidths(true);
                    t.calcPositions(true, true);
                    t.canReset = false;
                }
                t.timer = 0;
            }
            t.timer += 1;
        }, 1000);
        globalShortcut.register('CmdOrCtrl+W', () => {
            if (remote.getCurrentWindow().isFocused()) {
                for (var i = 0; i < tabs.length; i++) {
                    if (tabs[i].selected) {
                        t.removeTab(tabs[i]);
                    }
                }
            }
        });
        globalShortcut.register('CmdOrCtrl+O', () => {
            if (remote.getCurrentWindow().isFocused()) {
                for (var i = 0; i < tabs.length; i++) {
                    if (!tabs[i].isSelected()) {
                        t.removeTab(tabs[i], false);
                    }
                }
                var i = tabs.length;
                while (i--) {
                    if (!tabs[i].isSelected()) {
                        tabs.splice(i, 1);
                    }
                }
                t.calcWidths(true, true);
                t.calcPositions(true, true);
            }
        });
    }
    /*
    * selects tab
    * tab - <Tab>
    */
    _selectTab(tab) {
        var page = tab.page;
        if (tab != null && page != null) {
            page.resize();
            tab.refs.tab.style.zIndex = 9999;
            $(page.getPage().refs.page).css({position: 'relative', opacity: 1, marginLeft: 0});
            tab.setForeground(Colors.getForegroundColor(tab.background), false);
            $(tab.refs.tab).css({backgroundColor: tab.background, 'color': tab.foreground});
            tab.selected = true;
            this.props.getApp().refs.titlebar.setBackground(shadeColor(tab.background, -0.2));
        }
    }
    /*
    * unselects tab
    * tab - <Tab>
    */
    _deselectTab(tab) {
        var page = tab.page;
        if (tab != null && page != null) {
            tab.refs.tab.style.zIndex = 1;
            $(page.getPage().refs.page).css({position: 'absolute', opacity: 0, height: 0, marginLeft: -9999});
            $(tab.refs.tab).css({
                backgroundColor: $(this.refs.tabBarContainer).css('background-color'),
                'color': this.props.getApp().refs.titlebar.foreground
            });
            tab.selected = false;
        }
    }
    /*
    * selects tab and unselects others
    * tab - <Tab>
    */
    selectTab(tab) {
        var tabs = window.tabs;
        if (tab != null && tab.page.getPage().refs.page != null) {
            for (var i = 0; i < tabs.length; i++) {
                if (tabs[i] == tab) {
                    //select
                    this._selectTab(tab);
                } else {
                    //deselect
                    this._deselectTab(tabs[i]);
                }
            }
        }
    }
    selectTabByIndex(index) {
        var tabs = window.tabs;
        if (tabs[index] != null && tabs[index].page.getPage().refs.page != null) {
            for (var i = 0; i < tabs.length; i++) {
                if (tabs[i] == tabs[index]) {
                    //select
                    this._selectTab(tabs[index]);
                } else {
                    //deselect
                    this._deselectTab(tabs[i]);
                }
            }
        }
    }
    /*
    * removes tab
    * tab - <Tab>
    */
    removeTab(tab, removeFromArray = true) {
        var tabs = window.tabs,
            newState = tab.state,
            index = tabs.indexOf(tab),
            t = this,
            newState2 = this.state;
        t.canReset = true;
        if (tabs.length == 1) {
            remote.getCurrentWindow().close();
        }
        if (removeFromArray)
            tabs.splice(index, 1);

        if (tab.isSelected()) {
            var prevTab = tabs[index - 1];
            if (prevTab == null) {
                this.selectTab(tabs[0]);
                tabs[0].page.focusSearchInput();
            } else {
                this.selectTab(prevTab);
                prevTab.page.focusSearchInput();
            }
        }
        if (index - 1 == tabs.length - 1) {
            if (tabs[0] != null) {
                if (tabs[0].refs.tab.offsetWidth < t.maxTabWidth) {
                    newState.render = false;
                    tab.page.removePage();
                    tab.setState(newState);
                    t.calcWidths(true);
                    t.calcPositions(true, true);
                } else {
                    $(tab.refs.tab).animate({
                        width: 0
                    }, {
                        duration: t.animationDuration - 5,
                        queue: false,
                        complete: function() {
                            newState.render = false;
                            tab.setState(newState);
                        },
                        easing: t.animationEasing
                    });
                    tab.page.removePage();
                    t.calcWidths(true);
                    t.calcPositions(true, true);
                }
            }
        } else {
            t.calcPositions(true, true);
            $(tab.refs.tab).animate({
                width: 0
            }, {
                duration: t.animationDuration - 5,
                queue: false,
                complete: function() {
                    newState.render = false;
                    tab.setState(newState);
                },
                easing: t.animationEasing
            });
            tab.page.removePage();
            t.timer = 0;
        }
    }
    /*
    * gets tab from mouse point
    * callingTab - <Tab>
    * cursorX - current cursor x position
    * returns <Tab>
    */
    getTabFromMousePoint(callingTab, cursorX) {
        var tabs = window.tabs;
        for (var i = 0; i < tabs.length; i++) {
            if (tabs[i] != callingTab) {
                if (this.contains(tabs[i], cursorX)) {
                    if (!tabs[i].locked)
                        return tabs[i];
                    }
                }
        }
    }
    /*
    * checks if <Tab>.refs.tab contains mouse x position
    * tabToCheck - <Tab>
    * cursorX - mouse x position
    * returns boolean
    */
    contains(tabToCheck, cursorX) {
        var rect = tabToCheck.refs.tab.getBoundingClientRect();
        if (cursorX >= rect.left && cursorX <= rect.right) {
            return true;
        }
        return false;
    }
    /*
    * sets widths for all tabs
    * animation (optional) - boolean default: false
    */
    calcWidths(animation = false) {
        var tabbarwidth = $(this.refs.tabBarContainer).width(),
            tabbar = this.refs.tabbar,
            addbtn = this.refs.addbtn,
            tabs = window.tabs,
            a = 0;
        for (var i = 0; i < tabs.length; i++) {
            var tabWidthTemp = (tabbarwidth - addbtn.offsetWidth - 2) / tabs.length;
            if (tabWidthTemp > this.maxTabWidth) {
                tabWidthTemp = this.maxTabWidth;
            }
            if (animation) {
                $(tabs[i].refs.tab).animate({
                    width: tabWidthTemp
                }, {
                    duration: this.animationDuration,
                    queue: false
                });
            } else {
                tabs[i].refs.tab.style.width = tabWidthTemp + 'px';
            }
            tabs[i].offsetWidth = tabWidthTemp;
            this.actualTabWidth = tabWidthTemp;
        }
        for (var i = 0; i < tabs.length; i++) {
            a += tabs[i].offsetWidth;
        }
    }
    /*
    * calculates and sets positions for tabs
    * animateTabs (optional) - boolean default: false
    * animateAddButton (optional) - boolean default: false
    */
    getPositions(callback = null) {
        var tabCountTemp = 0,
            tabs = window.tabs,
            lefts = [],
            a = 0;

        for (var i = 0; i < tabs.length; i++) {
            lefts.push(a);
            a += tabs[i].offsetWidth;
        }
        if (typeof(callback) === 'function') {
            callback(lefts);
        }
    }
    /*
    * only calculates widths for all tabs
    * callback function
    */
    getWidths(callback = null) {
        var tabbarwidth = $(this.refs.tabBarContainer).width(),
            addbtn = this.refs.addbtn,
            tabs = window.tabs;
        for (var i = 0; i < tabs.length; i++) {
            var tabWidthTemp = (tabbarwidth - addbtn.offsetWidth - 2) / tabs.length;
            if (tabWidthTemp > this.maxTabWidth) {
                tabWidthTemp = this.maxTabWidth;
            }
            this.actualTabWidth = tabWidthTemp;
        }
        if (typeof(callback) === 'function') {
            callback(tabWidthTemp);
        }
    }
    /*
    * calculates and sets positions for tabs
    * animateTabs (optional) - boolean default: false
    * animateAddButton (optional) - boolean default: false
    */
    calcPositions(animateTabs = false, animateAddButton = false) {
        var tabCountTemp = 0,
            tabs = window.tabs,
            addbtn = this.refs.addbtn,
            lefts = [],
            a = 0;

        for (var i = 0; i < tabs.length; i++) {
            lefts.push(a);
            a += tabs[i].offsetWidth;
        }

        for (var i = 0; i < tabs.length; i++) {
            if (animateTabs) {
                $(tabs[i].refs.tab).animate({
                    left: lefts[i]
                }, {
                    duration: this.animationDuration,
                    queue: false,
                    easing: this.animationEasing
                });
            } else {
                tabs[i].refs.tab.style.left = lefts[i] + 'px';
            }
            tabCountTemp += 1;
        }
        if (animateAddButton) {
            $(addbtn).animate({
                left: a
            }, {
                duration: this.animationDuration,
                queue: false,
                easing: this.animationEasing
            });
        } else {
            addbtn.style.left = a + 'px';
        }
    }
    /*
    * replaces tabs
    * firstIndex - number
    * secondIndex - number
    * firstTab - <Tab>
    * secondTab - <Tab>
    */
    replaceTabs(firstIndex, secondIndex, firstTab, secondTab) {
        window.tabs[firstIndex] = secondTab;
        window.tabs[secondIndex] = firstTab;
        this.changePos(secondTab);
    }
    /*
    * changes position of tab to its place
    * callingTab - <Tab>
    */
    changePos(callingTab) {
        callingTab.locked = true;
        var t = this,
            a = 0;
        for (var i = 0; i < window.tabs.indexOf(callingTab); i++) {
            a += window.tabs[i].refs.tab.offsetWidth;
        }

        $(callingTab.refs.tab).animate({
            left: a
        }, {
            queue: false,
            duration: this.animationDuration + 50,
            complete: function() {
                callingTab.locked = false;
            },
            easing: this.animationEasing
        });
    }
    /*
    * returns this
    */
    getTabBar() {
        return this;
    }
    render() {
        var t = this;
        return (
            <div ref="tabBarContainer" className="tabBarContainer">
                <div ref='tabbar' className="tabBar">

                    {this.props.getApp().getTabsToCreate().map(function(object, i) {
                        return <Tab getApp={t.props.getApp} getTabBar={t.getTabBar} page={object} key={i}></Tab>;
                    })
}
                    <div ref='addbtn' onClick={() => this.addTabClick(this)} className="addBtn">
                        <div className="addbtn-icon"></div>
                        <div className="border-horizontal2"></div>
                    </div>

                </div>
            </div>
        );
    }
}
