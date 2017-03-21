'use babel';
import React from 'react';
import ReactDOM from 'react-dom';
import Draggable from 'react-draggable';
import {Motion, spring} from 'react-motion';

import '../../../resources/browser/scss/tab.scss';

export default class Tab extends React.Component {
    constructor() {
        super();
        //global properties
        this.state = {
            left: 0,
            width: 0,
            backgroundColor: 'transparent',
            zIndex: 2,
            title: 'New tab',
            render: true,
            isTitleVisible: true,
            isCloseVisible: true
        }
        this.getPage = null;
        this.backgroundColor = '#fff';
        this.selected = false;
        this.pinned = false;
        this.width = 0;
        this.tab = null;
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

        var positions = this.props.getTabBar().getPositions().tabPositions;
        this.setState({
            left: positions[tabs.indexOf(this)]
        }, function() {
            this.props.getTabBar().setWidths();
            this.props.getTabBar().setPositions();
        });

        this.props.getApp().addPage(self.getTab);
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
            this.setState({
                isTitleVisible: false, isCloseVisible: false/* disable dragging */
            });
        } else {
            this.setState({
                isTitleVisible: true, isCloseVisible: true/* disable dragging */
            });
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
            backgroundColor: this.state.backgroundColor,
            zIndex: this.state.zIndex
        }
        var borderRightStyle = {
            right: -1
        };
        var titleStyle = {
            display: (this.state.isTitleVisible)
                ? 'block'
                : 'none'
        };
        var closeStyle = {
            display: (this.state.isCloseVisible)
                ? 'block'
                : 'none'
        };
        var tabHandlers = {
            onMouseDown: this.onMouseDown,
            onDoubleClick: this.onDoubleClick
        };

        if (this.state.render) {
            return (
                <Motion style={{
                    x: this.state.left,
                    width: this.state.width
                }}>
                    {value => <div {...tabHandlers} ref={(tab) => this.tab = tab} className="tab" style={{
                        width: value.width,
                        backgroundColor: tabStyle.backgroundColor,
                        zIndex: tabStyle.zIndex,
                        left: value.x
                    }}>
                        <div className="tab-mask">
                            <div className="tab-title" style={titleStyle}>{this.state.title}</div>
                            <div className="tab-close" style={closeStyle} onClick={this.onCloseClick}></div>
                        </div>
                        <div className="tab-border" style={borderRightStyle}></div>
                    </div>}
                </Motion>
            );
        }
        return null;
    }
}
