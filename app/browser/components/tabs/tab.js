import React from 'react';
import ReactDOM from 'react-dom';
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
            isCloseVisible: true,
            selected: false,
            isRightBorderVisible: true
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

    onMouseDown = (e) => {
        this.props.getTabBar().selectTab(this);
        this.props.getTabBar().dragData = {
            tabX: e.currentTarget.offsetLeft,
            mouseClickX: e.clientX,
            canDrag: true,
            tab: this
        };
        //set others tabs z index to smaller
        for (var i = 0; i < tabs.length; i++) {
            if (tabs[i] != this) {
                tabs[i].setState({zIndex: 1});
            }
        }
        //set currently dragging tab's z index to greater than others
        this.setState({zIndex: 2});
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
        var tempTabs = [];
        for (var i = 0; i < tabs.length; i++) {
            if (tabs[i].pinned) {
                tempTabs.push(tabs[i]);
            }
        }
        for (var i = 0; i < tabs.length; i++) {
            if (!tabs[i].pinned) {
                tempTabs.push(tabs[i]);
            }
        }
        tabs = tempTabs;
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
            zIndex: this.state.zIndex,
            borderRight: (this.state.selected)
                ? '1px solid rgba(0,0,0,0.2)'
                : 'none'
        }
        var tabHandlers = {
            onMouseDown: this.onMouseDown,
            onDoubleClick: this.onDoubleClick
        };
        var borderRightStyle = {
            right: -1,
            display: (this.state.selected || this.state.isRightBorderVisible)
                ? 'none'
                : 'block'
        };
        var borderRight2Style = {
            display: (this.state.selected)
                ? 'block'
                : 'none',
            right: 0
        };
        var borderLeftStyle = {
            display: (this.state.selected && tabs.indexOf(this) !== 0)
                ? 'block'
                : 'none'
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
                        <div className="tab-border2" style={borderLeftStyle}></div>
                        <div className="tab-border2" style={borderRight2Style}></div>
                    </div>}
                </Motion>
            );
        }
        return null;
    }
}
