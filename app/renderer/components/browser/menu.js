'use babel';
import React from 'react';
import ReactDOM from 'react-dom';
import Page from './page.js';
import Titlebar from './titlebar.js';
import Extension from './extension.js';
import {TweenMax, CSSPlugin} from 'gsap';

export default class MDMenu extends React.Component {
    constructor() {
        super();
        //binds
        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);
        this.menu = this.menu.bind(this);
        this.removeExtensions = this.removeExtensions.bind(this);
        //global properties
        this.openedMenu = false;
        this.state = {
            extensionsToCreate: []
        };
    }

    componentDidMount() {
        var t = this,
            menuNodes = this.refs.menuItems.getElementsByTagName('li');

        for (var i = 0; i < menuNodes.length; i++) {
            var node = menuNodes[i];
            if (node) {
                node.addEventListener('mousedown', function(e) {
                    var ripple = Ripple.createRipple(e.target, {
                    }, createRippleMouse(e.target, e));
                    Ripple.makeRipple(ripple);
                });
            }
        }
        window.addEventListener('resize', function() {
            var offset = window.innerWidth / 2 - t.props.getPage().refs.bar.refs.bar.offsetWidth / 2;
            t.refs.menu.css({display: 'block', right: offset + 'px'});
        });
        window.addEventListener('click', function() {
            if (t.openedMenu)
                t.hide();
        });
        this.refs.divider.css('height', this.refs.menu.clientHeight - 16);
        TweenMax.set(this.refs.menu, {css:{display: 'none'}});
    }

    show() {
        TweenMax.to(this.refs.menu, 0.2, {css:{top: 58, opacity: 1}});
        this.openedMenu = true;
        this.props.getPage().refs.bar.openedMenu = true;
        var offset = window.innerWidth / 2 - this.props.getPage().refs.bar.refs.bar.offsetWidth / 2;
        this.refs.menu.css({display: 'block', right: offset + 'px'});
    }

    hide() {
        var t = this;
        TweenMax.to(this.refs.menu, 0.2, {css:{top: 28, opacity: 0}, onComplete: function() {
            t.refs.menu.css('display', 'none');
            t.openedMenu = false;
            t.props.getPage().refs.bar.openedMenu = false;
        }});
    }

    menu() {
        if (this.openedMenu) {
            this.hide();
        } else {
            this.show();
        }
    }

    removeExtensions() {
        this.setState({extensionsToCreate: []});
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
                    <div ref="extensionsItems" className="extensions-items">
                        {this.state.extensionsToCreate.map(function(object, i) {
                            return <Extension key={i} object={object}></Extension>;
                        })}
                    </div>
            </div>

        );
    }
}
