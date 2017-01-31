'use babel';
import React from 'react';
import ReactDOM from 'react-dom';
import Page from './page.js';
import Titlebar from './titlebar.js';

export default class MDMenu extends React.Component {
    constructor() {
        super();
        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);
        this.menu = this.menu.bind(this);
        this.openedMenu = false;
    }

    componentDidMount() {
        var t = this,
            menuNodes = this.refs.menuItems.getElementsByTagName('li'),
            extensionsNodes = this.refs.extensionsItems.getElementsByTagName('li');

        for (var i = 0; i < menuNodes.length; i++) {
            var node = menuNodes[i];
            if (node) {
                node.addEventListener('mousedown', function(e) {
                    //TODO: make ripple
                });
            }
        }

        window.addEventListener('click', function() {
            t.hide();
        });
        this.refs.divider.css('height', this.refs.menu.clientHeight - 16);

        for (var i = 0; i <  extensionsNodes.length; i++) {
            var node = extensionsNodes[i];
            if (node) {
                node.addEventListener('mousedown', function(e) {
                    //TODO: make ripple
                });
            }
        }
    }

    render() {
        return (
            <div ref="menu" className="menu">
                    <ul ref="menuItems" className="menu-items">
                        <li className="ripple settings" ref="item">
                            <div className="icon"></div>
                            Settings
                        </li>
                        <li className="ripple history" ref="item" onClick={() => this.props.addTab("wexond://history", true)}>
                            <div className="icon"></div>
                            History
                        </li>
                        <li className="ripple bookmarks" ref="item">
                            <div className="icon"></div>
                            Bookmarks
                        </li>
                        <li className="ripple downloads" ref="item">
                            <div className="icon"></div>
                            Downloads
                        </li>
                        <li className="ripple extensions" ref="item" onClick={() => this.props.addTab("http://www.nersent.tk/wexond/wextore", true)}>
                            <div className="icon"></div>
                            Extensions
                        </li>
                        <li className="ripple fullscreen" ref="item" onClick={() => remote.getCurrentWindow().setFullScreen(remote.getCurrentWindow().isFullScreen()
                            ? false
                            : true)}>
                            <div className="icon"></div>
                            Fullscreen
                        </li>
                        <li className="ripple devtools" ref="item" onClick={() => this.props.getPage().getWebView().openDevTools()}>
                            <div className="icon"></div>
                            Developer tools
                        </li>
                        <li className="ripple screenshot" ref="item">
                            <div className="icon"></div>
                            Take screenshot
                        </li>
                        <li className="ripple privacy" ref="item">
                            <div className="icon"></div>
                            Private mode
                        </li>

                    </ul>
                    <div ref="divider" className="divider"></div>
                    <ul ref="extensionsItems" className="extensions-items">
                        <li className="ripple-icon">

                        </li>
                        <li className="ripple-icon">

                        </li>
                        <li className="ripple-icon">

                        </li>
                        <li className="ripple-icon">

                        </li>
                        <li className="ripple-icon">

                        </li>
                        <li className="ripple-icon">

                        </li>
                        <li className="ripple-icon">

                        </li>
                        <li className="ripple-icon">

                        </li>
                        <li className="ripple-icon">

                        </li>
                        <li className="ripple-icon">

                        </li>
                        <li className="ripple-icon">

                        </li>
                    </ul>
            </div>

        );
    }

    show() {
        /*
        TODO: animations for menu show
        $(this.refs.menu).css('display', 'block');
        $(this.refs.menu).animate({
            top: 52
        }, {
            duration: 200,
            queue: false
        });
        $(this.refs.menu).animate({
            opacity: 1
        }, {
            duration: 200,
            queue: false
        });
        this.openedMenu = true;
        */
    }

    hide() {
        var t = this;
        /*
        TODO: animations for menu hide
        $(this.refs.menu).animate({
            top: 28
        }, {
            duration: 200,
            queue: false
        });
        $(this.refs.menu).animate({
            opacity: 0
        }, {
            duration: 200,
            queue: false,
            complete: function() {
                $(this).css('display', 'none');
                t.openedMenu = false;
            }
        });
        */
    }

    menu() {
        if (this.openedMenu) {
            this.hide();
        } else {
            this.show();
        }
    }

}
