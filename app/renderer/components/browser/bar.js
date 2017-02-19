'use babel';
import React from 'react';
import Storage from '../../../classes/storage.js';

export default class Bar extends React.Component {
    constructor() {
        super();
        //global properties
        this.timeout = null;
        this.shown = false;
    }
    /*
    lifecycle
    */
    componentDidMount() {
        var t = this;
        document.body.addEventListener('mousemove', function(e) {
            if (e.pageY > 130 && !t.openedMenu && !t.locked) {
                t.hide();
                t.shown = false;
            }
            if (e.pageY <= 32) {
                clearTimeout(t.timeout);
                t.show();
                t.shown = true;
            }
            if (e.pageY < 82 && t.shown) {
                clearTimeout(t.timeout);
            }
        });
    }
    /*
    * shows bar
    */
    show = () => {
        if (this.refs.bar != null) {
            this.refs.bar.css('display', 'block');
            TweenMax.to(this.refs.bar, 0.2, {css:{top: 8, opacity: 1}});
        }
    }
    /*
    * hides bar
    */
    hide = () => {
        var t = this;
        if (this.refs.bar != null) {
            TweenMax.to(this.refs.bar, 0.2, {css:{top: -8, opacity: 0}, onComplete: function() {
                t.refs.bar.css('display', 'none');
            }});
        }
    }
    /*
    events
    */
    handleInput = (e) => {
        var suggestions = this.props.getPage().getSuggestions();
        suggestions.show(e.target.value);
    }
    handleFocusIn = (e) => {
        e.target.setSelectionRange(0, e.target.value.length);
    }
    handleKeyPress = (e) => {
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
    back = () => {
        this.props.getPage().getWebView().goBack();
    }
    forward = () => {
        this.props.getPage().getWebView().goForward();
    }
    refresh = () => {
        this.props.getPage().loadExtensions();
        this.props.getPage().getWebView().reload();
    }
    ripple(e) {
        var ripple = Ripple.createRipple(e.target, {
        }, createRippleCenter(e.target, 13));
        Ripple.makeRipple(ripple);
    }

    onClickFavourite = () => {
        var url = this.props.getPage().getWebView().getURL();
        this.props.getPage().setSnackbarText(url);
        this.props.getPage().getSnackbar().show();

        var title = this.props.getPage().title;
    }
    onClickMenu = (e) => {
        e.stopPropagation();
        this.props.getPage().getMenu().menu();
    }
    /*
    * returns Object favourite icon
    */
    getFavouriteIcon = () => {
        return this.refs.favourite_icon;
    }
    /*
    * returns search input
    */
    getSearchInput = () => {
        return this.refs.searchInput;
    }

    render() {
        return (
            <div className="bar" ref="bar">
                <div className="bar-icon back ripple-bar-icon no-select" onClick={this.back} onMouseDown={this.ripple}></div>
                <div className="bar-icon forward ripple-bar-icon no-select" onClick={this.forward} onMouseDown={this.ripple}></div>
                <div className="bar-icon refresh ripple-bar-icon no-select" onClick={this.refresh} onMouseDown={this.ripple}></div>
                <div className="border-horizontal no-select" style={{backgroundColor: '#212121', position:'relative', float: 'left', marginLeft: 12, height: 'calc(100% - 24px)'}}></div>
                <div className="search-icon no-select" style={{marginLeft: 12}}></div>
                <input onKeyPress={this.handleKeyPress} onFocus={this.handleFocusIn} onInput={this.handleInput} ref="searchInput" className="searchInput"></input>
                <div className="bar-icon menu-icon ripple-bar-icon no-select" onMouseDown={this.ripple} onClick={this.onClickMenu}></div>
                <div className="bar-icon favourite-icon ripple-bar-icon no-select" ref="favourite_icon" onMouseDown={this.ripple} onClick={this.onClickFavourite}></div>
            </div>
        );
    }
}
