'use babel';
import React from 'react';

export default class Suggestions extends React.Component {
    constructor() {
        super();
        //binds
        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.getSuggestions = this.getSuggestions.bind(this);
        //global variables
        this.canSuggest = false;
    }
    componentDidMount() {
        var searchInput = this.props.getPage().getSearchInput(),
            t = this;

        searchInput.addEventListener('input', this.getSuggestions);
        searchInput.onkeydown = this.handleKeyDown;

        globalShortcut.register('Esc', () => {
            if (remote.getCurrentWindow().isFocused())
                t.hide();
            }
        );

    }
    /*
    * hides suggestions window
    */
    hide() {
        this.refs.suggestionsWindow.css('display', 'none');
        this.props.getPage().getWebView().removeClass('blur');
    }
    /*
    * shows suggestions window
    */
    show() {
        this.refs.suggestionsWindow.css('display', 'block');
        this.props.getPage().getWebView().addClass('blur');
    }
    /*
    events
    */
    handleClick(self) {
        self.hide();
    }

    handleKeyDown(e) {
        var key = event.keyCode || event.charCode;
        //blacklist: backspace, enter, ctrl, alt, shift, tab, caps lock, delete, space
        if (key != 8 && key != 13 && key != 17 && key != 18 && key != 16 && key != 9 && key != 20 && key != 46 && key != 32) {
            this.canSuggest = true;
        }
        //arrow key up
        if (e.keyCode == 38) {
            e.preventDefault();
            var selected = this.refs.suggestionsWindow.getElementsByClassName('selected')[0],
                items = this.refs.suggestionsWindow.getElementsByTagName('li');

            //select first item from suggestions box
            if (selected == null) {
                items[0].addClass("selected");
                e.target.value = items[0].attr('link');
            } else {
                if (selected.prev() != null) {
                    for (var i = 0; i < items.length; i++) {
                        var node = items[i];
                        if (node) {
                            node.removeClass('selected');
                        }
                    }
                    selected.prev().addClass("selected");
                    e.target.value = selected.prev().attr('link');
                }
            }
            e.target.setSelectionRange(0, e.target.value.length);

        }
        //arrow key down
        if (e.keyCode == 40) {
            e.preventDefault();
            var selected = this.refs.suggestionsWindow.getElementsByClassName('selected')[0],
                items = this.refs.suggestionsWindow.getElementsByTagName('li');

            //select first item from suggestions box
            if (selected == null) {
                items[0].addClass("selected");
                e.target.value = items[0].attr('link');
            } else {
                if (selected.next() != null) {
                    for (var i = 0; i < items.length; i++) {
                        var node = items[i];
                        if (node) {
                            node.removeClass('selected');
                        }
                    }
                    selected.next().addClass("selected");
                    e.target.value = selected.next().attr('link');
                }
            }
            e.target.setSelectionRange(0, e.target.value.length);
        }
    }
    /*
    * gets suggestions from history and Internet
    */
    getSuggestions(e) {
        var key = e.keyCode || e.charCode,
            t = this,
            webview = this.props.getPage().getWebView();

        if (key != 40 && key != 38) {
            var inputText = e.target.value.toLowerCase().replace(getSelectionText(), "");
            if (inputText != "") {
                getHistoryData(function() {
                    getSearchData();
                });

                function getHistoryData(callback = null) {
                    requestUrl(historyPath, function(data) {
                        var json = data.toString();
                        //replace weird characters utf-8
                        json = json.replace("\ufeff", "");
                        var obj = JSON.parse(json);
                        if (inputText != "") {
                            var links = [];
                            for (var i = 0; i < obj.history.length; i++) {
                                var str = obj.history[i].link;
                                //remove http://, https:// etc. from item for better suggestions
                                if (str.startsWith("http://")) {
                                    str = str.split("http://")[1];
                                    if (str.startsWith("www.")) {
                                        str = str.split("www.")[1];
                                    }
                                }
                                if (str.startsWith("https://")) {
                                    str = str.split("https://")[1];
                                    if (str.startsWith("www.")) {
                                        str = str.split("www.")[1];
                                    }
                                }
                                var lastChar = str.substr(str.length - 1);
                                //google search engine
                                if (!(str.indexOf("google") !== -1 && str.indexOf("search?q=") !== -1)) {
                                    if (str.startsWith(inputText)) {
                                        links.push(str + "&mdash;" + obj.history[i].title);
                                    }
                                }
                            }
                            //check if links array has any child
                            if (links.length > 0) {

                                //get shortest link from array links
                                var oldLink = links.sort(function(a, b) {
                                    return a.length - b.length;
                                })[0];
                                var newLink = links.sort(function(a, b) {
                                    return a.length - b.length;
                                })[0];
                                //get important part of link ex. wexond.tk for better suggestions
                                if (!newLink.startsWith("wexond:")) {
                                    newLink = newLink.substr(0, newLink.indexOf('/'));
                                    var compareOldLink = oldLink.replace("/", "").split("&mdash")[0];
                                    var compareNewLink = newLink.replace("/", "").split("&mdash")[0];
                                    if (compareOldLink != compareNewLink) {
                                        links.push(newLink + "&mdash;" + oldLink.split("&mdash;")[1]);
                                    }
                                }
                                //sort links by length
                                links.sort(function(a, b) {
                                    return b.length - a.length;
                                });
                                //get most similar link to addressbar text
                                for (var i = 0; i < links.length; i++) {
                                    if (links[i] == "") {
                                        links.splice(i, 1);
                                    }
                                    if (links[i] != null) {
                                        var a = links[i].length - inputText.length;
                                        //move the most similar link to top
                                        if (a > -1) {
                                            var s = links[i];
                                            links.splice(i, 1);
                                            links.unshift(s);
                                        }
                                    }
                                }
                                //remove duplicates from array
                                var uniqueLinks1 = [],
                                    uniqueLinks = [],
                                    tempLinks = [];

                                for (var i = 0; i < links.length; i++) {
                                    tempLinks.push(links[i].split("&mdash")[0]);
                                }
                                for (var i = 0; i < tempLinks.length; i++) {
                                    if (!isInArray(tempLinks[i], uniqueLinks1)) {
                                        uniqueLinks1.push(tempLinks[i]);
                                    }
                                }
                                for (var i = 0; i < uniqueLinks1.length; i++) {
                                    if (!isInArray(uniqueLinks1[i], uniqueLinks)) {
                                        uniqueLinks.push(links[i]);
                                    }
                                }
                                //limit array length to 3
                                if (uniqueLinks.length > 4) {
                                    uniqueLinks.length = 4;
                                }
                                var finalLength = uniqueLinks.length;
                                if (finalLength > 5) {
                                    finalLength = 5;
                                }
                                if (finalLength < 0) {
                                    finalLength = 0;
                                }
                                var histories = t.refs.suggestionsWindow.getElementsByClassName('history');
                                //append missing items
                                while (histories.length < finalLength) {
                                    var item = document.createElement('li');
                                    item.className = "suggestions-li ripple history";
                                    item.attr('link', "");
                                    t.refs.suggestions.insertBefore(item, t.refs.suggestionsWindow.getElementsByTagName('li')[0]);

                                    item.addEventListener('click', function() {
                                        webview.loadURL('http://' + $(this).attr('link'));
                                    });
                                    item.addEventListener('mousedown', function() {
                                        //TODO: make ripple
                                    });
                                    item.addEventListener('mouseover', function() {
                                        var sItems = t.refs.suggestionsWindow.getElementsByClassName('suggestions-li');
                                        for (var i = 0; i < sItems.length; i++) {
                                            var node = sItems[i];
                                            if (node) {
                                                node.removeClass('selected');
                                            }
                                        }

                                        this.addClass("selected");
                                        e.target.value = this.attr('link');
                                    });

                                }
                                //remove excess items
                                while (histories.length > finalLength) {
                                    histories[0].parentNode.removeChild(histories[0]);
                                }
                                //change each item content to new link from array
                                for (var i = 0; i < histories.length; i++) {
                                    var link = uniqueLinks[i].split('&mdash;')[0],
                                        title = uniqueLinks[i].split('&mdash;')[1];

                                    histories[i].innerHTML = '<span class="link">' + link + ' </span>' + `<span class="title">&mdash; ${title}</span`;
                                    histories[i].attr('link', link);
                                }

                                if (t.canSuggest) {
                                    var link = uniqueLinks[0].split('&mdash;')[0];
                                    autocomplete(e.target, link);
                                    t.canSuggest = false;
                                }
                            } else {
                                var histories = t.refs.suggestionsWindow.getElementsByClassName('history');
                                for (var i = 0; i < histories.length; i++) {
                                    histories[i].parentNode.removeChild(histories[i]);
                                }
                            }

                        } else {
                            var histories = t.refs.suggestionsWindow.getElementsByClassName('history');
                            //if addressbar text is empty, clear all items
                            for (var i = 0; i < histories.length; i++) {
                                histories[i].parentNode.removeChild(histories[i]);
                            }
                        }
                        var histories = t.refs.suggestionsWindow.getElementsByClassName('history');
                        if (!(histories.length <= 0)) {
                            //select first item from suggestions box
                            var items = t.refs.suggestionsWindow.getElementsByTagName('li');
                            for (var i = 0; i < items.length; i++) {
                                var node = items[0];
                                if (node) {
                                    node.removeClass('selected');
                                }
                            }
                            items[0].addClass("selected");
                        }
                        if (callback != null) {
                            callback();
                        }
                    });
                }
                function getSearchData() {
                    requestUrl("http://google.com/complete/search?client=firefox&q=" + inputText, function(data) {
                        var obj = JSON.parse(data);
                        var links = [];
                        //filter links
                        for (var i = 0; i < obj[1].length; i++) {
                            if (!isInArray(obj[1][i], links)) {
                                links.push(obj[1][i]);
                            }
                        }
                        if (links.length > 0) {}
                        //remove duplicates from array
                        var uniqueLinks = [];
                        for (var i = 0; i < links.length; i++) {
                            if (!isInArray(links[i], uniqueLinks)) {
                                uniqueLinks.push(links[i]);
                            }
                        }
                        //sort array by length
                        uniqueLinks.sort(function(a, b) {
                            return a.length - b.length;
                        });
                        //limit array length to 3
                        if (uniqueLinks.length > 5) {
                            uniqueLinks.length = 5;
                        }
                        var finalLength = uniqueLinks.length;
                        if (finalLength > 5) {
                            finalLength = 5;
                        }
                        if (finalLength < 0) {
                            finalLength = 0;
                        }
                        var internets = t.refs.suggestionsWindow.getElementsByClassName('internet');
                        //append missing items
                        while (internets.length < finalLength) {
                            var item = document.createElement('li');
                            item.className = "suggestions-li ripple internet";
                            item.attr('link', "");
                            t.refs.suggestions.appendChild(item);

                            item.addEventListener('click', function() {
                                webview.loadURL("http://www.google.com/search?q=" + this.attr('link'));
                            });
                            item.addEventListener('mousedown', function() {
                                //TODO: make ripple
                            });
                            item.addEventListener('mouseover', function() {
                                var sItems = t.refs.suggestionsWindow.getElementsByClassName('suggestions-li');
                                for (var i = 0; i < sItems.length; i++) {
                                    var node = sItems[i];
                                    if (node) {
                                        node.removeClass('selected');
                                    }
                                }

                                this.addClass("selected");
                                e.target.value = this.attr('link');
                            });
                        }
                        //remove excess items
                        while (internets.length > finalLength) {
                            internets[0].parentNode.removeChild(internets[0]);
                        }
                        //change each item content to new link from array
                        for (var i = 0; i < internets.length; i++) {
                            internets[i].innerHTML = '<span class="title">' + uniqueLinks[i] + '</span>';
                            internets[i].attr('link', uniqueLinks[i]);
                        }
                    });
                }
            }
        }
    }
    render() {
        return (
            <div ref="suggestionsWindow" onClick={() => this.handleClick(this)} className="suggestions-window">
                <ul ref="suggestions" className="suggestions"></ul>
            </div>
        );
    }
}
