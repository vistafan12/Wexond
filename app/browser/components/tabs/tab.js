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
            zIndex: 1,
            title: 'New tab',
            render: true,
            isTitleVisible: true,
            isCloseVisible: true,
            selected: false,
            isRightBorderVisible: true,
            animateColor: false
        }
        this.getPage = null;
        this.selectedBackgroundColor = '#fff';
        this.selected = false;
        this.pinned = false;
        this.width = 0;
        this.tab = null;
        this.locked = false;
        this.mouseLeaveBgColor = null;
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
            canDrag: (!this.pinned) ? true : false,
            tab: this
        };
    }

    onMouseEnter = () => {
        if (!this.selected) {
            var rgba = shadeColor(this.state.backgroundColor, 0.05);
            this.mouseLeaveBgColor = this.state.backgroundColor;
            this.setState(
                {
                    backgroundColor: rgba,
                    animateColor: true
                }
            );
            if (!this.pinned) {
                this.setState({isCloseVisible: true});
            }
        }
    }

    onMouseLeave = () => {
        var self = this;
        if (!this.selected) {
            this.setState(
                {
                    backgroundColor: this.mouseLeaveBgColor,
                    animateColor: true,
                    isCloseVisible: false
                }
            );
            setTimeout(function() {
                self.setState({animateColor: false});
            }, 200);
        }
    }

    onPageInitialized = () => {
        if (this.props.data.select) {
            this.props.getTabBar().selectTab(this);
        }
    }

    onCloseClick = () => {
        if (this.state.isCloseVisible) {
            this.props.getTabBar().closeTab(this);
        }
    }

    onDoubleClick = () => {
        if (!this.pinned) {
            this.setState({
                isTitleVisible: false,
                isCloseVisible: false
            });
        } else {
            this.setState({
                isTitleVisible: true,
                isCloseVisible: true
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
        var self = this;
        var tabHandlers = {
            onMouseDown: this.onMouseDown,
            onDoubleClick: this.onDoubleClick,
            onMouseEnter: this.onMouseEnter,
            onMouseLeave: this.onMouseLeave
        };
        var borderRightStyle = {
            right: -1,
            display: (this.state.selected || !this.state.isRightBorderVisible)
                ? 'none'
                : 'block',
            backgroundColor: this.props.getTabBar().state.borderColor
        };
        var borderRight2Style = {
            display: (this.state.selected)
                ? 'block'
                : 'none',
            right: 0,
            backgroundColor: this.props.getTabBar().state.borderColor
        };
        var borderLeftStyle = {
            display: (this.state.selected && tabs.indexOf(this) !== 0)
                ? 'block'
                : 'none',
            backgroundColor: this.props.getTabBar().state.borderColor
        };
        var titleStyle = {
            display: (this.state.isTitleVisible)
                ? 'block'
                : 'none',
            maxWidth: (this.state.isCloseVisible) ? 'calc(100% - 48px)' : 'calc(100% - 28px)'
        };
        var closeStyle = {
            opacity: (this.state.isCloseVisible)
                ? 1
                : 0
        };

        if (this.state.render) {
            return (
                <Motion style={{
                    x: this.state.left,
                    width: this.state.width,
                }}>
                    {value => <div {...tabHandlers} ref={(tab) => this.tab = tab} className="tab" style={{
                        width: value.width,
                        backgroundColor: this.state.backgroundColor,
                        zIndex: this.state.zIndex,
                        left: value.x,
                        transition: (this.state.animateColor) ? '0.2s background-color' : 'none'
                    }}>
                        <div className="tab-mask">
                            <div className="tab-title" style={titleStyle}>{this.state.title}</div>
                            <div className="tab-close-container" style={closeStyle}>
                                <div className="tab-close" onClick={this.onCloseClick}></div>
                            </div>
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
