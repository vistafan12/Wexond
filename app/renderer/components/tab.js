'use babel';
import React from 'react';
import {TweenMax, CSSPlugin} from "gsap";
import Draggable from 'gsap/draggable';
require('../public/js/main.js');
export default class Tab extends React.Component {
    constructor() {
        super();
        //binds
        this.changeTitle = this.changeTitle.bind(this);
        this.changeFavicon = this.changeFavicon.bind(this);
        this.getIndex = this.getIndex.bind(this);
        this.isSelected = this.isSelected.bind(this);
        this.setBackground = this.setBackground.bind(this);
        this.setForeground = this.setForeground.bind(this);
        this.getTab = this.getTab.bind(this);
        this.onDragStart = this.onDragStart.bind(this);
        this.onDrag = this.onDrag.bind(this);
        //global properties
        this.locked = false;
        this.animationDuration = 150;
        this.getPage = null;
        this.tab = null;
        this.selected = false;
        this.foreground = '#212121';
        this.background = '#fff';
        //state
        this.state = {
            title: "New tab",
            render: true
        };
    }
    /*
    lifecycle
    */
    componentDidMount() {
        this.getPage = this.props.page;
        var pass = this.getTab,
            t = this,
            tabbar = this.props.getTabBar();

        this.getPage().associateTab(pass);
        tabs.push(this);

        if (this.getPage().select) {
            tabbar.selectTab(this);
        } else {
            tabbar._deselectTab(this);
        }
        TweenMax.set(t.tab, {css:{left: tabbar.getPositions()[tabs.indexOf(t)]}});
        tabbar.calcWidths(true);
        tabbar.calcPositions(true, true);

        tabbar.getWidths(function(width) {
            if (width < t.props.maxTabWidth) {
                t.tab.css({width: 0, marginLeft: width});
            } else {
                t.tab.css({width: 0});
            }
            TweenMax.to(t.tab, tabsAnimationDuration, {width: width, ease: Circ.easeOut, onComplete: function() {
                tabbar.calcWidths(true);
                tabbar.calcPositions(true, true);
            }});
        });

        this.getPage().getExtensions().loadExtensions(this.getIndex());
        this.getPage().focusSearchInput();

        this.drag = Draggable.create(this.tab, {
            onDragStart: t.onDragStart,
            onRelease: t.onRelease,
            onDrag: t.onDrag,
            type: "left",
            cursor: "default"
        });
    }
    /*
    events
    */
    onDragStart() {
        this.props.getTabBar().selectTab(this);
    }
    onRelease(e) {
        this.props.getTabBar().calcPositions(true, true);
    }
    onDrag(e) {
        for (var i = 0; i < tabs.length; i++) {
            tabs[i].tab.style.zIndex = 1;
        }
        this.tab.style.zIndex = 9999;
        this.reorderTabs(this, e.pageX);
    }
    onMouseDown(self) {
        self.props.getTabBar().selectTab(self);
    }
    onMouseEnter(self) {
        if (!self.isSelected()) {
            TweenMax.to(self.tab, 0.5, {backgroundColor: `rgba(255,255,255,${tabsHoverTransparency})`, ease: tabsAnimationEasing});
            TweenMax.to(self.closeBtn, 0.2, {opacity: 0.6, ease: tabsAnimationEasing});
            self.tabTitle.css('max-width', 'calc(100% - 64px)');
        }
    }
    onMouseLeave(self) {
        if (!self.isSelected()) {
            TweenMax.to(self.tab, 0.5, {backgroundColor: 'rgba(255,255,255,0)', ease: tabsAnimationEasing});
            TweenMax.to(self.closeBtn, 0.2, {opacity: 0, ease: tabsAnimationEasing});
            self.tabTitle.css('max-width', 'calc(100% - 48px)');
        }
    }
    onMouseLeaveCloseBtn(e) {
        TweenMax.to(e.target, 0.2, {opacity: 0.6, ease: tabsAnimationEasing});
    }
    onMouseEnterCloseBtn(e) {
        TweenMax.to(e.target, 0.2, {opacity: 1, ease: tabsAnimationEasing});
    }
    /*
    * returns Object tabbar
    */
    getTabbar() {
        return this.props.getTabBar();
    }
    /*
    * returns boolean
    */
    isSelected() {
        return this.selected;
    }
    /*
    * sets background
    * color - String color
    */
    setBackground(color) {
        this.background = color;
        if (this.selected) {
            this.tab.css('background-color', color);
        }
    }
    /*
    * sets foreground
    * color - String color
    */
    setForeground(color, force) {
        this.foreground = color;

        if (force) {
            this.tab.css('color', color);
        } else {
            if (this.selected) {
                this.tab.css('color', color);
            }
        }
    }
    /*
    * gets index of current tab
    * returns int
    */
    getIndex() {
        return tabs.indexOf(this);
    }
    /*
    * changes tab's title
    * newTitle - string
    */
    changeTitle(newTitle) {
        var state = this.state;
        state.title = newTitle;
        this.setState(state);
    }
    /*
    * changes favicon
    * favicon - string
    */
    changeFavicon(favicon) {
        this.favicon.css({backgroundImage: `url(${favicon})`});
    }
    /*
    events
    */
    closeBtnClick(self, e) {
        e.stopPropagation();
        e.preventDefault();
        self.props.getTabBar().removeTab(self);
    }
    /*
    * returns this
    */
    getTab() {
        return this;
    }
    /*
    * reorders tabs
    * self = this
    * cursorX - current cursor x position
    */
    reorderTabs(self, cursorX) {
        var overTab = self.props.getTabBar().getTabFromMousePoint(self, cursorX);
        if (overTab != null) {
            var indexTab = tabs.indexOf(self),
                indexOverTab = tabs.indexOf(overTab);
            self.props.getTabBar().replaceTabs(indexTab, indexOverTab, self, overTab);
        }
    }

    render() {
        if (this.state.render) {
            return (
                <div ref={(tab) => { this.tab = tab; }} onMouseDown={()=>this.onMouseDown(this)} onMouseEnter={()=>this.onMouseEnter(this)} onMouseLeave={()=>this.onMouseLeave(this)} style={{width: 100}} className="tab draggable">
                    <div className="border-horizontal" style={{left: 0}}></div>
                    <div className="content">
                        <div ref={(fav) => { this.favicon = fav; }} className="favicon"></div>
                        <div className="tabTitle" ref={(title) => { this.tabTitle = title; }}>{this.state.title}</div>
                        <div className="closeBtn" ref={(btn) => { this.closeBtn = btn; }} onMouseEnter={this.onMouseEnterCloseBtn} onMouseLeave={this.onMouseLeaveCloseBtn} onClick={(e) => this.closeBtnClick(this, e)}></div>
                    </div>
                </div>
            );
        }
        return null;
    }
}
