'use babel';
import React from 'react';

export default class Bar extends React.Component {
    constructor() {
        super();
        //binds
        this.handleInput = this.handleInput.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.refresh = this.refresh.bind(this);
    }
    /*
    lifecycle
    */
    componentDidMount() {
        var t = this,
            nodes = this.refs.bar.getElementsByClassName('bar-icon');
        for(var i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            if (node) {
                node.addEventListener('mousedown', function() {
                    makeRippleIconButton(this);
                });
            }
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
        this.props.getPage().reloadExtensions();
        this.props.getPage().getWebView().reload();
    }

    render() {
        return (
            <div className="bar" ref="bar">
                <div className="bar-icon back ripple-bar-icon" onClick={() => this.back(this)} onMouseDown={this.ripple}></div>
                <div className="bar-icon forward ripple-bar-icon" onClick={() => this.forward(this)} onMouseDown={this.ripple}></div>
                <div className="bar-icon refresh ripple-bar-icon" onClick={() => this.refresh(this)} onMouseDown={this.ripple}></div>
                <div ref="searchBox" className="searchBox">
                    <input onKeyPress={(e) => this.handleKeyPress(e)} onFocus={(e) => this.handleFocusIn(e)} onInput={this.handleInput} ref="searchInput" className="searchInput"></input>
                </div>
                <div className="bar-icon menu-icon ripple-bar-icon" onMouseDown={this.ripple} onClick={(e) => {
                    e.stopPropagation();
                    this.props.getPage().getMenu().menu();
                }}></div>
            </div>
        );
    }
}
