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
        this.maxTabWidth = 190
        this.actualTabWidth = this.maxTabWidth
        this.animationDuration = 150
        this.animationEasing = 'easeOutCirc'
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
            $(page.getPage()).css({position: 'relative', opacity: 1, marginLeft: 0})
            $(tab.refs.tab).css({backgroundColor: '#3F51B5', 'color': '#fff'})
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
            $(page.getPage()).css({position: 'absolute', opacity: 0, height: 0, marginLeft: -9999})
            $(tab.refs.tab).css({backgroundColor: $(self.refs.tabBarContainer).css('background-color'), 'color': '#fff'})

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
            if (tabs[0] != null) {
                if (tabs[0].refs.tab.offsetWidth < t.maxTabWidth) {
                    newState.render = false
                    tab.state.page.removePage()
                    tab.setState(newState)
                    t.calcWidths(true)
                    t.calcPositions(true, true)
                } else {
                    $(tab.refs.tab).animate({
                        width: 0
                    }, {
                        duration: t.animationDuration - 5,
                        queue: false,
                        complete: function() {
                            newState.render = false
                            tab.setState(newState)
                        },
                        easing: t.animationEasing
                    })
                    tab.state.page.removePage()
                    t.calcWidths(true)
                    t.calcPositions(true, true)
                }
            }
        } else {
            for (var i = 0; i < 999; i++) {
                clearTimeout(i)
            }
            setTimeout(function() {
                t.calcWidths(true)
                t.calcPositions(true, true)
            }, 4000)
            t.calcPositions(true, true)
            $(tab.refs.tab).animate({
                width: 0
            }, {
                duration: t.animationDuration - 5,
                queue: false,
                complete: function() {
                    newState.render = false
                    tab.setState(newState)
                },
                easing: t.animationEasing
            })
            tab.state.page.removePage()
        }
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
        var tabbarwidth = $(this.refs.tabBarContainer).width(),
            tabbar = this.refs.tabbar,
            addbtn = this.refs.addbtn,
            tabs = this.state.tabs,
            a = 0
        for (var i = 0; i < tabs.length; i++) {
            var tabWidthTemp = (tabbarwidth - addbtn.offsetWidth - 2) / tabs.length
            if (tabWidthTemp > this.maxTabWidth) {
                tabWidthTemp = this.maxTabWidth
            }
            if (animation) {
                $(tabs[i].refs.tab).animate({
                    width: tabWidthTemp
                }, {
                    duration: this.animationDuration,
                    queue: false
                })
            } else {
                tabs[i].refs.tab.style.width = tabWidthTemp + 'px'
            }
            tabs[i].offsetWidth = tabWidthTemp
            this.actualTabWidth = tabWidthTemp
        }
        for (var i = 0; i < tabs.length; i++) {
            a += tabs[i].offsetWidth
        }
        $(tabbar).animate({width: a + addbtn.offsetWidth + 1}, {duration: this.animationDuration, easing: this.animationEasing, queue: false})
    }
    /*
    * only calculates widths for all tabs
    * callback function
    */
    getWidths(callback = null) {
        var tabbarwidth = $(this.refs.tabBarContainer).width(),
            addbtn = this.refs.addbtn,
            tabs = this.state.tabs
        for (var i = 0; i < tabs.length; i++) {
            var tabWidthTemp = (tabbarwidth - addbtn.offsetWidth - 2) / tabs.length
            if (tabWidthTemp > this.maxTabWidth) {
                tabWidthTemp = this.maxTabWidth
            }
            this.actualTabWidth = tabWidthTemp
        }
        if (typeof(callback) === 'function') {
            callback(tabWidthTemp)
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
            addbtn = this.refs.addbtn,
            lefts = [],
            a = 0

        for (var i = 0; i < tabs.length; i++) {
            lefts.push(a)
            a += tabs[i].offsetWidth
        }

        for (var i = 0; i < tabs.length; i++) {
            if (animateTabs) {
                $(tabs[i].refs.tab).animate({
                    left: lefts[i]
                }, {
                    duration: this.animationDuration,
                    queue: false,
                    easing: this.animationEasing
                })
            } else {
                tabs[i].refs.tab.style.left = lefts[i] + 'px'
            }
            tabCountTemp += 1
        }
        if (animateAddButton) {
            $(addbtn).animate({
                left: a
            }, {
                duration: this.animationDuration,
                queue: false,
                easing: this.animationEasing
            })
        } else {
            addbtn.style.left = a + 'px'
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
        var t = this,
            a = 0
        for (var i = 0; i < t.state.tabs.indexOf(callingTab); i++) {
            a += t.state.tabs[i].refs.tab.offsetWidth - 2
        }
        $(callingTab.refs.tab).animate({
            left: a
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
            <div ref="tabBarContainer" className="tabBarContainer">
                <div ref='tabbar' className="tabBar">

                    {this.props.getTabsToCreate().map(function(object, i) {
                        return <Tab maxTabWidth={t.maxTabWidth} getWidths={t.getWidths} changePos={t.changePos} replaceTabs={t.replaceTabs} getTabFromMousePoint={t.getTabFromMousePoint} tabs={t.state.tabs} calcPositions={t.calcPositions} calcWidths={t.calcWidths} removeTab={t.removeTab} selectTab={t.selectTab} addTabToArray={t.addTabToArray} page={object} key={i}></Tab>
                        })
                    }
                        <div ref='addbtn' onClick={() => this.addTabClick(this)} className="addBtn">
                            <i className="material-icons">add</i>
                            <div className="border-horizontal2"></div>
                        </div>

                    </div>
            </div>
        )
    }
}
