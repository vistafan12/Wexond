'use babel';
import React from 'react';

export default class Bar extends React.Component {
    constructor() {
        super()
    }
    /*
    lifecycle
    */
    componentDidMount() {
        var t = this,
        searchInput = this.refs.searchInput
        $(searchInput).focusin(function() {
            this.setSelectionRange(0, this.value.length)
        })
        $(searchInput).on("input", function (e) {
            var suggestions = t.props.getSuggestions()
            suggestions.show()
        })
        $(searchInput).keypress(function (e) {
            var webview = t.props.getWebView(),
                suggestions = t.props.getSuggestions()
                //if enter key was pressed
             if (e.which == 13) {
                 suggestions.hide()
                 if (!$(this).val().startsWith("webexpress://")) {
                     if (isURL($(this).val())) {
                         if ($(this).val().startsWith("http://") || $(this).val().startsWith("https://") || $(this).val().startsWith("file://")) {
                             webview.loadURL($(this).val());
                         } else {
                             webview.loadURL("http://" + $(this).val());
                         }
                     } else {
                         //TODO: search engines
                         webview.loadURL("http://www.google.com/search?q=" + $(this).val());
                     }
                 } else {
                     webview.loadURL($(this).val());
                 }

                 return false;
             }
         });
    }

    render() {
        return (
            <div className="bar">
                <i className="material-icons">arrow_back</i>
                <i className="material-icons">arrow_forward</i>
                <i className="material-icons">refresh</i>
                <div className="searchBox">
                    <input ref="searchInput" className="searchInput"></input>
                </div>
                <i className="material-icons">menu</i>
            </div>
        )
    }
}
