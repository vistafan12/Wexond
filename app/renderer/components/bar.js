'use babel';
import React from 'react';

export default class Bar extends React.Component {
    constructor() {
        super();
        //binds
        this.handleInput = this.handleInput.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.refresh = this.refresh.bind(this);
        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);
    }
    /*
    lifecycle
    */
    componentDidMount() {
        var t = this,
            nodes = this.refs.bar.getElementsByClassName('bar-icon');
        for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            if (node) {
                node.addEventListener('mousedown', function() {
                    makeRippleBarButton(this);
                });
            }
        }
        document.body.addEventListener('mousemove', function(e) {
            if (e.pageY <= 32) {
                t.show();
            }
            if (e.pageY > 82 && !t.openedMenu && !t.locked) {
                t.hide();
            }
        });
    }
    /*
    * shows bar
    */
    show() {
        if (this.refs.bar != null) {
            this.refs.bar.css('display', 'block');
            TweenMax.to(this.refs.bar, 0.2, {
                css: {
                    top: 8,
                    opacity: 1
                }
            });
        }
    }
    /*
    * hides bar
    */
    hide() {
        var t = this;
        if (this.refs.bar != null) {
            TweenMax.to(this.refs.bar, 0.2, {
                css: {
                    top: -8,
                    opacity: 0
                },
                onComplete: function() {
                    t.refs.bar.css('display', 'none');
                }
            });
        }
    }
    /*
    events
    */
    handleInput() {
        var suggestions = this.props.getPage().getSuggestions();
        suggestions.show();
    }
    handleFocusIn(e) {
        e.target.setSelectionRange(0, e.target.value.length);
    }
    handleKeyPress(e) {
        var webview = this.props.getPage().getWebView(),
            suggestions = this.props.getPage().getSuggestions();
        //if enter key was pressed
        if (e.which == 13) {
            this.locked = false;
            suggestions.hide();
            if (!e.target.value.startsWith("wexond://")) {
                if (isURL(e.target.value)) {
                    if (e.target.value.startsWith("http://") || e.target.value.startsWith("https://") || e.target.value.startsWith("file://")) {
                        webview.loadURL(e.target.value);
                    } else {
                        webview.loadURL("http://" + e.target.value);
                    }
                } else {
                    //TODO: search engines
                    webview.loadURL("http://www.google.com/search?q=" + e.target.value);
                }
            } else {
                webview.loadURL(e.target.value);
            }

            return false;
        }
    }
    back(self) {
        self.props.getPage().getWebView().goBack();
    }
    forward(self) {
        self.props.getPage().getWebView().goForward();
    }
    refresh() {
        this.props.getPage().loadExtensions();
        this.props.getPage().getWebView().reload();
    }

    render() {
        return (
            <div className="bar" ref="bar">
                <div className="bar-icon back ripple-bar-icon" onClick={() => this.back(this)} onMouseDown={this.ripple}></div>
                <div className="bar-icon forward ripple-bar-icon" onClick={() => this.forward(this)} onMouseDown={this.ripple}></div>
                <div className="bar-icon refresh ripple-bar-icon" onClick={() => this.refresh(this)} onMouseDown={this.ripple}></div>
                <input onKeyPress={(e) => this.handleKeyPress(e)} onFocus={(e) => this.handleFocusIn(e)} onInput={this.handleInput} ref="searchInput" className="searchInput"></input>
                <div className="bar-icon menu-icon ripple-bar-icon" onMouseDown={this.ripple} onClick={(e) => {
                    e.stopPropagation();
                    this.props.getPage().getMenu().menu();
                }}></div>
            </div>
        );
    }
}
