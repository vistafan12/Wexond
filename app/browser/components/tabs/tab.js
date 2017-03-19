import React from 'react';
import ReactDOM from 'react-dom';

import Draggable from 'react-draggable';

import '../../../resources/browser/scss/tab.scss';

export default class Tab extends React.Component {
    constructor() {
        super();
        //global properties
        this.state = {
            left: 0,
            width: 0,
            backgroundColor: 'transparent',
            zIndex: 1,
            title: 'New tab',
            render: true,
            showTitle: true,
            showClose: true
        }
        this.getPage = null;
        this.backgroundColor = '#fff';
        this.selected = false;
        this.pinned = false;
        this.width = 0;
    }
    /*
    lifecycle
    */
    componentDidMount() {
        var self = this;

        tabs.push(this);

        if (tabs.indexOf(this) == 0) {
            this.setState({showLeftBorder: false});
        } else {
            this.setState({showLeftBorder: true});
        }

        this.props.getTabBar().setWidths();
        this.props.getTabBar().setPositions();

        this.props.getApp().addPage(self.getTab);
    }
    /*
    events
    */
    onDragStop = () => {
        this.props.getTabBar().setPositions();
        this.props.getTabBar().setState({addButtonVisibility: 'block'});
    }
    /*
    * @param1 {Object} e
    */
    onDrag = (e) => {
        this.props.getTabBar().setState({addButtonVisibility: 'none'});
        this.reorderTabs(e.pageX);
    }

    onDragStart = (e) => {
        //set others tabs z index to smaller
        for (var i = 0; i < tabs.length; i++) {
            if (tabs[i] != this) {
                tabs[i].setState({zIndex: 1});
            }
        }
        //set currently dragging tab's z index to greater than others
        this.setState({zIndex: 2});
    }

    onMouseDown = () => {
        this.props.getTabBar().selectTab(this);
    }

    onPageInitialized = () => {
        if (this.props.data.select) {
            this.props.getTabBar().selectTab(this);
        }
    }

    onCloseClick = () => {
        this.props.getTabBar().closeTab(this);
    }

    onDoubleClick = () => {
        if (!this.pinned) {
            this.setState({showTitle: false, showClose: false, isDraggingDisabled: true});
        } else {
            this.setState({showTitle: true, showClose: true, isDraggingDisabled: false});
        }
        this.pinned = !this.pinned;
        var pinnedTabs = [];
        for (var x = 0; x < tabs.length; x++) {
            if (tabs[x].pinned) {
                pinnedTabs.push(tabs[x]);
            }
        }
        for (var x = tabs.length - 1; x >= 0; x--) {
            for (var y = pinnedTabs.length - 1; y >= 0; y--) {
                if (!tabs[x].pinned) {
                    this.props.getTabBar().replaceTabs(x, tabs.indexOf(pinnedTabs[y]));
                }
            }
        }
        this.props.getTabBar().setWidths();
        this.props.getTabBar().setPositions();
    }
    /*
    * updates default position for draggable
    * @param1 {Number} mouseX
    */
    setDraggablePosition = (mouseX) => {
        var draggablePosition = this.getDraggablePosition(mouseX);
        this.setState({left: mouseX - draggablePosition});
    }
    /*
    * gets draggable position
    * @param1 {Number} mouseX
    * @return {Number}
    */
    getDraggablePosition = (mouseX) => {
        return mouseX - this.refs.tab.getBoundingClientRect().left;
    }
    /*
    * reorders tabs
    * @param1 {Number} cursorX
    */
    reorderTabs = (cursorX) => {
        if (!this.pinned) {
            var overTab = this.props.getTabBar().getTabFromMousePoint(this, cursorX);
            if (overTab != null && !overTab.pinned) {
                var indexTab = tabs.indexOf(this);
                var indexOverTab = tabs.indexOf(overTab);
                this.props.getTabBar().replaceTabs(indexTab, indexOverTab);
            }
        }
    }
    /*
    * gets tab
    * @return {Tab}
    */
    getTab = () => {
        return this;
    }

    render() {
        var tabStyle = {
            width: this.state.width,
            backgroundColor: this.state.backgroundColor,
            zIndex: this.state.zIndex
        }
        var borderRightStyle = {
            right: -1
        };
        var draggablePosition = {
            x: this.state.left,
            y: 0
        };
        var titleStyle = {
            display: (this.state.showTitle) ? 'block' : 'none'
        };
        var closeStyle = {
            display: (this.state.showClose) ? 'block' : 'none'
        };

        if (this.state.render) {
            return (
                <Draggable onMouseDown={this.onMouseDown} bounds="parent" axis="x" position={draggablePosition} onStop={this.onDragStop} onStart={this.onDragStart} onDrag={this.onDrag}>
                    <div onDoubleClick={this.onDoubleClick} ref="tab" className="tab" style={tabStyle}>
                        <div className="tab-title" style={titleStyle}>{this.state.title}</div>
                        <div className="tab-border" style={borderRightStyle}></div>
                        <div className="tab-close" style={closeStyle} onClick={this.onCloseClick}></div>
                    </div>
                </Draggable>
            );
        }
        return null;
    }
}
