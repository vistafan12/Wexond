'use babel';
import React from 'react';
import Colors from '../../../helpers/colors';
require('../../../resources/browser/scss/titlebar.scss');

export default class Titlebar extends React.Component {
    constructor() {
        super();
        //global properties
        this.foreground = '#fff';
        this.state = {
            closeStyle: {
                backgroundImage: 'url(browser/img/controls/close.png)'
            },
            maximizeStyle: {
                backgroundImage: 'url(browser/img/controls/maximize.png)'
            },
            minimizeStyle: {
                backgroundImage: 'url(browser/img/controls/minimize.png)'
            },
            backgroundColor: '',
            visible: true
        };
    }
    /*
    * sets titlebar background color
    * @param1 {String} color
    */
    setBackground = (color) => {
        this.setState({backgroundColor: color});
        this.setForeground(Colors.getForegroundColor(color));
    }
    /*
    * sets titlebar foreground color
    * @param1 {String} color
    */
    setForeground = (color) => {
        //TODO: set foreground for titlebar
    }
    /*
    * sets titlebar visibility
    * @param1 {Boolean} flag
    */
    setVisible = (flag) => {
        this.setState({visible: flag});
    }
    /*
    * gets titlebar visibility
    * @return {Boolean}
    */
    isVisible = () => {
        return this.state.visible;
    }

    render() {
        var closeStyle = {
            backgroundImage: this.state.closeStyle.backgroundImage
        };
        var maximizeStyle = {
            backgroundImage: this.state.maximizeStyle.backgroundImage
        };
        var minimizeStyle = {
            backgroundImage: this.state.minimizeStyle.backgroundImage
        };

        var visibility = (this.state.visible) ? "block" : "none";

        return (
            <div>
                <div ref="titlebar" style={{
                    backgroundColor: this.state.backgroundColor,
                    display: visibility
                }} className="titlebar">
                    <div className="titlebar-controls">
                        <div className="titlebar-control" style={closeStyle} onClick={this.props.getApp().close}></div>
                        <div className="titlebar-control" style={maximizeStyle} onClick={this.props.getApp().maximizeOrRestore}></div>
                        <div className="titlebar-control" style={minimizeStyle} onClick={this.props.getApp().minimizeOrRestore}></div>
                    </div>

                    {this.props.children}

                    <div className="border-bottom"></div>
                </div>
            </div>
        );
    }
}
