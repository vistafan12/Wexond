'use babel';
import React from 'react';
require('../public/js/main.js');
export default class Tab extends React.Component {
    constructor() {
        super();
        //binds
        this.changeTitle = this.changeTitle.bind(this);
        this.setPage = this.setPage.bind(this);
        this.changeFavicon = this.changeFavicon.bind(this);
        this.getIndex = this.getIndex.bind(this);
        this.isSelected = this.isSelected.bind(this);
        this.setBackground = this.setBackground.bind(this);
        this.setForeground = this.setForeground.bind(this);
        //global properties
        this.locked = false;
        this.animationDuration = 150;
        this.page = null;
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
        this.setPage(this.props.page);
        var pass = {
                changeTitle: this.changeTitle,
                setPage: this.setPage,
                changeFavicon: this.changeFavicon,
                refs: this.refs,
                getIndex: this.getIndex,
                isSelected: this.isSelected,
                setForeground: this.setForeground,
                setBackground: this.setBackground,
                selectTabByIndex: this.props.getTabBar().selectTabByIndex
            },
            t = this,
            tabbar = this.props.getTabBar();

        this.page.associateTab(pass);
        window.tabs.push(this);

        if (this.props.page.select) {
            tabbar.selectTab(this);
        }
        else {
            tabbar._deselectTab(this);
        }

        tabbar.calcWidths(true);
        tabbar.getPositions(function(lefts) {
            $(t.refs.tab).css('left', lefts[lefts.length - 1]);
        });
        tabbar.calcPositions(true, true);
        this.makeDraggable(this);
        tabbar.getWidths(function(width) {
            if (width < t.props.maxTabWidth) {
                $(t.refs.tab).css({width: 0, marginLeft: width});
            } else {
                $(t.refs.tab).css({width: 0});
            }
            $(t.refs.tab).animate({
                width: width,
                marginLeft: 0
            }, {
                duration: t.animationDuration,
                queue: false,
                complete: function() {
                    tabbar.calcWidths(true);
                    tabbar.calcPositions(true, true);
                },
                easing: 'easeOutQuint'
            });

        });
        this.page.getExtensions().loadExtensions(this.getIndex());
        this.page.focusSearchInput();
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
            $(this.refs.tab).css('background-color', color);
        }
    }
    /*
    * sets foreground
    * color - String color
    */
    setForeground(color, force) {
        this.foreground = color;

        if (force) {
            $(this.refs.tab).css('color', color);
        } else {
            if (this.selected) {
                $(this.refs.tab).css('color', color);
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
        $(this.refs.favicon).css({backgroundImage: `url(${favicon})`});
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
    * sets this.page to new value
    * page - object of page
    */
    setPage(page) {
        this.page = page;
    }
    /*
    * makes tab able to draggable
    * self = this
    */
    makeDraggable(self) {
        var tabRef = self.refs.tab,
            tabs = window.tabs;
        function handle_mousedown(e) {
            if (e.target.tagName != 'I') {
                self.props.getTabBar().selectTab(self);
                window.my_dragging = {};
                my_dragging.pageX0 = e.pageX;
                my_dragging.pageY0 = e.pageY;
                my_dragging.elem = this;
                my_dragging.offset0 = $(this).offset();
                function handle_dragging(e) {
                    var left = my_dragging.offset0.left + (e.pageX - my_dragging.pageX0);
                    $(my_dragging.elem).offset({left: left});
                    for (var i = 0; i < tabs.length; i++) {
                        tabs[i].refs.tab.style.zIndex = 1;
                    }
                    tabRef.style.zIndex = 9999;
                    self.reorderTabs(self, e.pageX);
                }
                function handle_mouseup(e) {
                    $(window).off('mousemove', handle_dragging).off('mouseup', handle_mouseup);
                    self.props.getTabBar().calcPositions(true, true);
                }
                $(window).on('mouseup', handle_mouseup).on('mousemove', handle_dragging);
            }
        }
        $(tabRef).mousedown(handle_mousedown);
    }
    /*
    * reorders tabs
    * self = this
    * cursorX - current cursor x position
    */
    reorderTabs(self, cursorX) {
        var overTab = self.props.getTabBar().getTabFromMousePoint(self, cursorX),
            tabs = window.tabs;
        if (overTab != null) {
            var indexTab = tabs.indexOf(self),
                indexOverTab = tabs.indexOf(overTab);
            self.props.getTabBar().replaceTabs(indexTab, indexOverTab, self, overTab);
        }
    }

    render() {
        if (this.state.render) {
            return (
                <div ref="tab" className="tab draggable">
                    <div className="border-horizontal"></div>
                    <div className="content">
                        <div ref="favicon" className="favicon"></div>
                        <div className="tabTitle">{this.state.title}</div>
                        <div className="closeBtn" ref="closeBtn" onClick={(e) => this.closeBtnClick(this, e)}></div>
                    </div>
                </div>
            );
        }
        return null;
    }
}
