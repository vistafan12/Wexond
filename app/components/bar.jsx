'use babel';
import React from 'react';

export default class Bar extends React.Component {
    constructor() {
        super()
        //binds
        this.handleInput = this.handleInput.bind(this)
        this.handleKeyPress = this.handleKeyPress.bind(this)
        this.setHoverColor = this.setHoverColor.bind(this)
        this.refresh = this.refresh.bind(this)
        this.hoverColor = 'rgba(0, 0, 0, 0.2)'
    }
    /*
    lifecycle
    */
    componentDidMount() {
        var t = this
        $(this.refs.bar).find('i').mouseover(function() {
            $(this).css('background-color', t.hoverColor)
        })
        $(this.refs.bar).find('i').mouseout(function() {
            $(this).css('background-color', 'transparent')
        })
    }
    /*
    events
    */
    handleInput() {
        var suggestions = this.props.getSuggestions()
        suggestions.show()
    }
    handleFocusIn(e) {
        e.target.setSelectionRange(0, e.target.value.length)
    }
    handleKeyPress(e) {
        var webview = this.props.getWebView(),
            suggestions = this.props.getSuggestions()
            //if enter key was pressed
         if (e.which == 13) {
             suggestions.hide()
             if (!e.target.value.startsWith("webexpress://")) {
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
        self.props.getWebView().goBack()
    }
    forward(self) {
        self.props.getWebView().goForward()
    }
    refresh() {
        this.props.reloadExtensions()
        this.props.getWebView().reload()
    }

    /*
    * sets hover color
    * color - String color
    */
    setHoverColor(color) {
        this.hoverColor = color
    }

    render() {
        return (

            <div className="bar" ref="bar">
                <i className="material-icons" onClick={()=> this.back(this)}>arrow_back</i>
                <i className="material-icons" onClick={()=> this.forward(this)}>arrow_forward</i>
                <i onClick={()=> this.refresh(this)} className="material-icons">refresh</i>
                <div ref="searchBox" className="searchBox">
                    <input onKeyPress={(e)=>this.handleKeyPress(e)} onFocus={(e)=>this.handleFocusIn(e)} onInput={this.handleInput} ref="searchInput" className="searchInput"></input>
                </div>
                <i className="material-icons">menu</i>
            </div>
        )
    }
}
