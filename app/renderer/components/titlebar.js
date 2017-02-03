'use babel';
import React from 'react';
import TabBar from './tabbar.js';
import Colors from '../../classes/colors.js';

export default class Titlebar extends React.Component {
    constructor() {
        super();
        //binds
        this.setBackground = this.setBackground.bind(this);
        this.setForeground = this.setForeground.bind(this);
        this.maximizeOrRestore = this.maximizeOrRestore.bind(this);
        //global properties
        this.foreground = '#fff';
        this.state = {
            closeStyle: {
                backgroundImage: 'url(img/controls/close.png)'
            },
            maximizeStyle: {
                backgroundImage: 'url(img/controls/maximize.png)'
            },
            minimizeStyle: {
                backgroundImage: 'url(img/controls/minimize.png)'
            }
        };
    }
    componentDidMount() {}
    /*
    * closes window
    */
    close() {
        remote.getCurrentWindow().close();
    }
    /*
    * maximizes / restores window
    */
    maximizeOrRestore() {
        if (remote.getCurrentWindow().isMaximized()) {
            //restore window
            remote.getCurrentWindow().unmaximize();
            document.body.css({top: '0px'});
        } else {
            //maximize window
            remote.getCurrentWindow().maximize();
            document.body.css({top: '4px'});
        }
    }
    /*
    * minimizes / restores window
    */
    minimizeOrRestore() {
        if (remote.getCurrentWindow().isMinimized()) {
            //restore window
            remote.getCurrentWindow().restore();
        } else {
            //minimize window
            remote.getCurrentWindow().minimize();
        }
    }
    /*
    * sets titlebar background color
    * color - String color
    */
    setBackground(color) {
        this.refs.titlebar.css('background-color', color);
        this.setForeground(Colors.getForegroundColor(color));
    }
    /*
    * sets titlebar foreground color
    * color - String color
    */
    setForeground(color) {
        this.foreground = color;
        for (var i = 0; i < tabs.length; i++) {
            if (!tabs[i].selected)
                tabs[i].setForeground(color, true);
            }
        this.refs.tabbar.refs.tabbar.css('color', color);

        var horizontalBorders = document.querySelectorAll('.border-horizontal'),
            bottomBorders = document.querySelectorAll('.border-bottom'),
            closeBtns = this.refs.tabbar.refs.tabbar.querySelectorAll('.closeBtn'),
            addBtns = this.refs.tabbar.refs.tabbar.querySelectorAll('.addBtn'),
            controls = this.refs.titlebar.querySelectorAll('.control');

        for (var i = 0; i < horizontalBorders.length; i++) {
            var node = horizontalBorders[i];
            if (node) {
                node.css('background-color', color);
            }
        }
        for (var i = 0; i < bottomBorders.length; i++) {
            var node = bottomBorders[i];
            if (node) {
                node.css('background-color', color);
            }
        }

        if (color == "white") {
            for (var i = 0; i < closeBtns.length; i++) {
                var node = closeBtns[i];
                if (node) {
                    node.addClass('white-icon');
                }
            }
            for (var i = 0; i < addBtns.length; i++) {
                var node = addBtns[i];
                if (node) {
                    node.addClass('white-icon');
                }
            }
            for (var i = 0; i < controls.length; i++) {
                var node = controls[i];
                if (node) {
                    node.addClass('white-icon');
                }
            }
        } else if (color == "black") {
            for (var i = 0; i < closeBtns.length; i++) {
                var node = closeBtns[i];
                if (node) {
                    node.removeClass('white-icon');
                }
            }
            for (var i = 0; i < addBtns.length; i++) {
                var node = addBtns[i];
                if (node) {
                    node.removeClass('white-icon');
                }
            }
            for (var i = 0; i < controls.length; i++) {
                var node = controls[i];
                if (node) {
                    node.removeClass('white-icon');
                }
            }
        }
    }

    render() {
        var closeStyle = {
                backgroundImage: this.state.closeStyle.backgroundImage
            },
            maximizeStyle = {
                backgroundImage: this.state.maximizeStyle.backgroundImage
            },
            minimizeStyle = {
                backgroundImage: this.state.minimizeStyle.backgroundImage
            };
        return (
            <div>
                <div ref="titlebar" className="titlebar">
                    <div className="window-controls">
                        <div className="control" style={closeStyle} onClick={this.close}></div>
                        <div className="control" style={maximizeStyle} onClick={this.maximizeOrRestore}></div>
                        <div className="control" style={minimizeStyle} onClick={this.minimizeOrRestore}></div>
                    </div>
                    <TabBar getApp={this.props.getApp} ref="tabbar"></TabBar>
                    <div className="border-bottom"></div>
                </div>
            </div>
        );
    }
}
