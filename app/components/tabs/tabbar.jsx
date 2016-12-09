'use babel';
import React from 'react';
import Tab from './tab.jsx';

export default class TabBar extends React.Component {
    constructor() {
        super()
        //binds
        this.addTabToArray = this.addTabToArray.bind(this)
        this.selectTab = this.selectTab.bind(this)
        this.removeTab = this.removeTab.bind(this)
        this.calcWidths = this.calcWidths.bind(this)
        this.calcPositions = this.calcPositions.bind(this)
        this.changePos = this.changePos.bind(this)
        this.getTabFromMousePoint = this.getTabFromMousePoint.bind(this)
        this.replaceTabs = this.replaceTabs.bind(this)
        this.getWidths = this.getWidths.bind(this)
        //global properties
        this.maxTabWidth = 200
        this.actualTabWidth = this.maxTabWidth
        this.animationDuration = 150
        this.animationEasing = 'cubic-bezier'
        //state
        this.state = {
            tabs: []
        }
    }
    /*
    events
    */
    addTabClick(self) {
        self.props.addPage()
    }
    /*
    lifecycle
    */
    componentDidMount() {
        var t = this
        window.addEventListener('resize', function() {
            t.calcWidths()
            t.calcPositions()
        })
    }
    /*
    * selects tab
    * self = this
    * tab - <Tab>
    */
    _selectTab(self, tab) {
        var page = tab.state.page
        if (tab != null && page != null) {
            page.resize()
            tab.refs.tab.style.zIndex = 9999
            $(page.getPage()).css({position: 'relative', opacity: 1, visibility: 'visible'})
            $(tab.refs.tab).css('background-color', 'white')
        }
    }
    /*
    * unselects tab
    * self = this
    * tab - <Tab>
    */
    _deselectTab(self, tab) {
        var page = tab.state.page
        if (tab != null && page != null) {
            tab.refs.tab.style.zIndex = 1
            $(page.getPage()).css({position: 'absolute', opacity: 0, visibility: 'hidden', height: 0})
            $(tab.refs.tab).css('background-color', '#eee')
        }
    }
    /*
    * selects tab and unselects others
    * tab - <Tab>
    */
    selectTab(tab) {
        var tabs = this.state.tabs
        if (tab != null && tab.state.page.getPage() != null) {
            for (var i = 0; i < tabs.length; i++) {
                if (tabs[i] == tab) {
                    //select
                    this._selectTab(this, tab)
                } else {
                    //deselect
                    this._deselectTab(this, tabs[i])
                }
            }
        }
    }
    /*
    * removes tab
    * tab - <Tab>
    */
    removeTab(tab) {
        var tabs = this.state.tabs,
            newState = tab.state,
            index = tabs.indexOf(tab),
            t = this,
            newState2 = this.state

        newState2.tabs.splice(index, 1)
        this.setState(newState2)

        var prevTab = tabs[index - 1]
        if (prevTab == null) {
            this.selectTab(tabs[0])
        } else {
            this.selectTab(prevTab)
        }

        if (index - 1 == tabs.length - 1) {

        } else {
            for (var i = 0; i < 999; i++) {
                clearTimeout(i)
            }
            setTimeout(function() {
                t.calcWidths()
                t.calcPositions(true, true)
            }, 4000)
        }
        $(tab.refs.tab).animate({
            width: 0
        }, {
            duration: t.animationDuration - 5,
            queue: false,
            complete: function() {
                if (index - 1 == tabs.length - 1) {
                    t.calcWidths()
                    t.calcPositions(true, true)
                }
                newState.render = false
                tab.state.page.removePage()
                tab.setState(newState)
                t.calcPositions(true, true)
            },
            easing: t.animationEasing
        })

    }
    /*
    * adds tab to array
    * tab - <Tab>
    */
    addTabToArray(tab) {
        var newState = this.state
        newState.tabs.push(tab)
        this.setState(newState)
    }
    /*
    * gets tab from mouse point
    * callingTab - <Tab>
    * cursorX - current cursor x position
    * returns <Tab>
    */
    getTabFromMousePoint(callingTab, cursorX) {
        var tabs = this.state.tabs
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
    */
    calcWidths(animation = false) {
        var tabbar = this.refs.tabbar,
            addbtn = this.refs.addbtn,
            tabs = this.state.tabs
        for (var i = 0; i < tabs.length; i++) {
            var tabWidthTemp = (tabbar.offsetWidth - addbtn.offsetWidth - 2) / tabs.length
            if (tabWidthTemp > this.maxTabWidth) {
                tabWidthTemp = this.maxTabWidth
            }
            if (animation) {
                $(tabs[i].refs.tab).animate({width: this.animationDuration}, {duration: 150, queue: false})
            } else {
                tabs[i].refs.tab.style.width = tabWidthTemp + 'px'
            }

            this.actualTabWidth = tabWidthTemp
        }
    }
    /*
    * only calculates widths for all tabs
    * callback function
    */
    getWidths(callback = null) {
        var tabbar = this.refs.tabbar,
            addbtn = this.refs.addbtn,
            tabs = this.state.tabs
        for (var i = 0; i < tabs.length; i++) {
            var tabWidthTemp = (tabbar.offsetWidth - addbtn.offsetWidth - 2) / tabs.length
            if (tabWidthTemp > this.maxTabWidth) {
                tabWidthTemp = this.maxTabWidth
            }
            this.actualTabWidth = tabWidthTemp
            if (typeof(callback) === 'function') {
                callback(tabWidthTemp)
            }
        }
    }
    /*
    * calculates and sets positions for tabs
    * animateTabs (optional) - boolean default: false
    * animateAddButton (optional) - boolean default: false
    */
    calcPositions(animateTabs = false, animateAddButton = false) {
        var tabCountTemp = 0,
            tabs = this.state.tabs,
            addbtn = this.refs.addbtn
        for (var i = 0; i < tabs.length; i++) {
            if (animateTabs) {
                $(tabs[i].refs.tab).animate({
                    left: tabCountTemp * (this.actualTabWidth)
                }, {
                    duration: this.animationDuration,
                    queue: false,
                    easing: this.animationEasing
                })
            } else {
                tabs[i].refs.tab.style.left = tabCountTemp * (this.actualTabWidth) + 'px'
            }
            tabCountTemp += 1
        }
        if (animateAddButton) {
            $(addbtn).animate({
                left: (tabCountTemp * (this.actualTabWidth)) + 2
            }, {
                duration: this.animationDuration,
                queue: false,
                easing: this.animationEasing
            })
        } else {
            addbtn.style.left = (tabCountTemp * (this.actualTabWidth)) + 2 + 'px'
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
        var newState = this.state
        newState.tabs[firstIndex] = secondTab
        newState.tabs[secondIndex] = firstTab
        this.setState(newState)
        this.changePos(secondTab)
    }
    /*
    * changes position of tab to its place
    * callingTab - <Tab>
    */
    changePos(callingTab) {
        callingTab.locked = true
        var t = this
        $(callingTab.refs.tab).animate({
            left: t.state.tabs.indexOf(callingTab) * (t.actualTabWidth)
        }, {
            query: false,
            duration: this.animationDuration + 50,
            complete: function() {
                callingTab.locked = false
            },
            easing: this.animationEasing
        })
    }
    render() {
        var t = this
        return (
            <div>
                <div ref='tabbar' className="tabBar">
                    {
                        this.props.getTabsToCreate().map(function(object, i) {
                            return <Tab getWidths={t.getWidths} changePos={t.changePos} replaceTabs={t.replaceTabs} getTabFromMousePoint={t.getTabFromMousePoint} tabs={t.state.tabs} calcPositions={t.calcPositions} calcWidths={t.calcWidths} removeTab={t.removeTab} selectTab={t.selectTab} addTabToArray={t.addTabToArray} page={object} key={i}></Tab>
                            })
                        }
                        <div ref='addbtn' onClick={() => this.addTabClick(this)} className="addBtn"></div>
                        <div className="border5"></div>
                </div>
            </div>
        )
    }
}
