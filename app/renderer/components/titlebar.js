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
        } else {
            //maximize window
            remote.getCurrentWindow().maximize();
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
        $(this.refs.titlebar).css('background-color', color);
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
        $(this.refs.tabbar.refs.tabbar).css('color', color);
        $('.border-horizontal').css('background-color', color);
        $('.border-horizontal2').css('background-color', color);
        $('.border-bottom').css('background-color', color);
        if (color == "white") {
            $(this.refs.tabbar.refs.tabbar).find('.closeBtn').addClass('white-icon');
            $(this.refs.tabbar.refs.tabbar).find('.addBtn').addClass('white-icon');
            $(this.refs.titlebar).find('.control').addClass('white-icon');
        } else if (color == "black") {
            $(this.refs.tabbar.refs.tabbar).find('.closeBtn').removeClass('white-icon');
            $(this.refs.tabbar.refs.tabbar).find('.addBtn').removeClass('white-icon');
            $(this.refs.titlebar).find('.control').removeClass('white-icon');
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
