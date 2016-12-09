'use babel';
import React from 'react';

export default class Tab extends React.Component {
    constructor() {
        super()
        //binds
        this.changeTitle = this.changeTitle.bind(this)
        this.setPage = this.setPage.bind(this)
        //global properties
        this.locked = false
        this.animationDuration = 125
        //state
        this.state = {
            title: "New tab",
            render: true,
            page: null
        }
    }
    /*
    lifecycle
    */
    componentDidMount() {
        this.setPage(this.props.page)
        var pass = {
            changeTitle: this.changeTitle,
            setPage: this.setPage
        }
        this.state.page.associateTab(pass)
        this.props.addTabToArray(this)
        this.props.selectTab(this)
        this.props.calcWidths()
        this.props.calcPositions(false, true)
        this.makeDraggable(this)
        var t = this
        this.props.getWidths(function(width) {
            $(t.refs.tab).css({width: 0}).animate({
                width: width
            }, {
                duration: t.animationDuration,
                queue: false,
                complete: function() {
                    t.props.calcWidths()
                    t.props.calcPositions(false, true)
                },
                easing: 'cubic-bezier'
            })
        })

    }
    /*
    * changes tab's title
    * newTitle - string
    */
    changeTitle(newTitle) {
        var state = this.state
        state.title = newTitle
        this.setState(state)
    }
    /*
    events
    */
    handleMouseDown(self, e) {
        self.props.selectTab(self)
    }
    closeBtnClick(self, e) {
        e.stopPropagation()
        e.preventDefault()
        self.props.removeTab(self)
    }
    /*
    * sets this.state.page to new value
    * page - object of page
    */
    setPage(page) {
        var newState = this.state
        newState.page = page
        this.setState(newState)
    }
    /*
    * makes tab able to draggable
    * self = this
    */
    makeDraggable(self) {
        var tabRef = self.refs.tab,
            tabs = self.props.tabs
        function handle_mousedown(e) {
            if (e.target != self.refs.closeBtn) {
                e.preventDefault()
                e.stopPropagation()
                window.my_dragging = {};
                my_dragging.pageX0 = e.pageX;
                my_dragging.pageY0 = e.pageY;
                my_dragging.elem = this;
                my_dragging.offset0 = $(this).offset();
                function handle_dragging(e) {
                    var left = my_dragging.offset0.left + (e.pageX - my_dragging.pageX0);
                    $(my_dragging.elem).offset({left: left});
                    for (var i = 0; i < tabs.length; i++) {
                        tabs[i].refs.tab.style.zIndex = 1
                    }
                    tabRef.style.zIndex = 9999
                    self.reorderTabs(self, e.pageX)
                }
                function handle_mouseup(e) {
                    $(window).off('mousemove', handle_dragging).off('mouseup', handle_mouseup);
                    self.props.changePos(self)
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
        var overTab = self.props.getTabFromMousePoint(self, cursorX),
            tabs = self.props.tabs
        if (overTab != null) {
            var indexTab = tabs.indexOf(self),
                indexOverTab = tabs.indexOf(overTab)
            self.props.replaceTabs(indexTab, indexOverTab, self, overTab)
        }
    }

    render() {
        if (this.state.render) {
            return (
                <div ref="tab" onMouseDown={(e) => this.handleMouseDown(this, e)} className="tab draggable">
                    <div className="tabTitle">{this.state.title}</div>
                    <div className="closeBtn" ref="closeBtn" onClick={(e) => this.closeBtnClick(this, e)}></div>
                </div>
            )
        }
        return null
    }
}
