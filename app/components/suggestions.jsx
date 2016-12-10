'use babel'
import React from 'react'

export default class Suggestions extends React.Component {
    constructor() {
        super()
        //binds
        this.show = this.show.bind(this)
        this.hide = this.hide.bind(this)
        this.handleKeyDown = this.handleKeyDown.bind(this)
        this.getSuggestions = this.getSuggestions.bind(this)
        //global variables
        this.canSuggest = false
    }
    componentDidMount() {
        var searchInput = this.props.getSearchInput()

        searchInput.addEventListener('input', this.getSuggestions)
        searchInput.onkeydown = this.handleKeyDown
    }
    /*
    * hides suggestions window
    */
    hide() {
        $(this.refs.suggestionsWindow).css('display', 'none')
        $(this.props.getWebView()).removeClass('blur')
    }
    /*
    * shows suggestions window
    */
    show() {
        $(this.refs.suggestionsWindow).css('display', 'block')
        $(this.props.getWebView()).addClass('blur')
    }
    /*
    events
    */
    handleClick(self) {
        self.hide()
    }
    handleKeyDown(e) {
        var key = event.keyCode || event.charCode;
        //blacklist: backspace, enter, ctrl, alt, shift, tab, caps lock, delete, space
        if (key != 8 && key != 13 && key != 17 && key != 18 && key != 16 && key != 9 && key != 20 && key != 46 && key != 32) {
            this.canSuggest = true
        }
        var selected = $('.selected')
        //arrow key up
        if (e.keyCode == 38) {
            e.preventDefault();
            e.target.setSelectionRange(0, e.target.value.length)
            e.target.value = selected.prev().attr('link')

            $('li').removeClass("selected");
            if (selected.prev().length == 0) {
                selected.first().addClass("selected");
                e.target.value = selected.first().attr('link')
            } else {
                selected.prev().addClass("selected");
            }
            e.target.setSelectionRange(0, e.target.value.length)
        }
        //arrow key down
        if (e.keyCode == 40) {
            e.preventDefault();
            e.target.setSelectionRange(0, e.target.value.length)
            e.target.value = selected.next().attr('link')

            $('li').removeClass("selected");
            if (selected.next().length == 0) {
                selected.last().addClass("selected");
                e.target.value = selected.last().attr('link')
            } else {
                selected.next().addClass("selected");
            }
            e.target.setSelectionRange(0, e.target.value.length)

        }
    }
    /*
    * gets suggestions from history and Internet
    */
    getSuggestions(e) {
        var key = e.keyCode || e.charCode,
            t = this,
            webview = this.props.getWebView()

        if (key != 40 && key != 38) {
            //get suggestions from history
            var inputText = e.target.value.toLowerCase().replace(getSelectionText(), "");
            if (inputText != "") {
                $.ajax({
                    type: "GET",
                    url: historyPath,
                    success: function(data) {
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
                                if (str.split('/').length == 2 && lastChar == "/") {
                                    str = str.replace('/', '');
                                }
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
                                //get important part of link ex. webexpress.tk for better suggestions
                                newLink = newLink.substr(0, newLink.indexOf('/'));
                                if (oldLink != newLink) {
                                    links.push(newLink);
                                }
                                //sort links by length
                                links.sort(function(a, b) {
                                    return b.length - a.length;
                                });
                                //get most similar link to addressbar text
                                for (var i = 0; i < links.length; i++) {
                                    if (links[i] == "") {
                                        links.splice(i, 1)
                                    }
                                    if (links[i] != null) {
                                        var a = links[i].length - inputText.length;
                                        //move the most similar link to top
                                        if (a > -1) {
                                            var s = links[i];
                                            links.splice(i, 1)
                                            links.unshift(s)
                                        }
                                    }
                                }
                                //remove duplicates from array
                                var uniqueLinks = [];
                                $.each(links, function(i, el) {
                                    if ($.inArray(el, uniqueLinks) === -1)
                                        uniqueLinks.push(el)
                                });
                                //limit array length to 3
                                if (uniqueLinks.length > 3) {
                                    uniqueLinks.length = 3;
                                }
                                var finalLength = uniqueLinks.length;
                                if (finalLength > 3) {
                                    finalLength = 3;
                                }
                                if (finalLength < 0) {
                                    finalLength = 0;
                                }
                                //append missing items
                                while ($('.history').length < finalLength) {
                                    var s = $('<li data-ripple-color="#444" class="suggestions-li ripple history" link=""></li>').prependTo($(t.refs.suggestions));
                                    s.click(function(e) {
                                        webview.loadURL('http://' + $(this).attr('link'));
                                    });
                                    s.mousedown(function(e) {
                                        //TODO: make ripple
                                    });
                                    s.mouseover(function() {
                                        $('.suggestions-li').removeClass("selected");
                                        $(this).addClass("selected");
                                        e.target.value = $(this).attr('link')
                                    });

                                }
                                //remove excess items
                                while ($('.history').length > finalLength) {
                                    $('.history').first().remove()
                                }
                                //change each item content to new link from array
                                $('.history').each(function(i) {
                                    var link = uniqueLinks[i].split('&mdash;')[0],
                                        title = uniqueLinks[i].split('&mdash;')[1]
                                    $(this).html('<span class="link">' + link + ' </span>' + `<span class="title">&mdash; ${title}</span`);
                                    $(this).attr('link', link);
                                })

                                if (t.canSuggest) {
                                    var link = uniqueLinks[0].split('&mdash;')[0]
                                    autocomplete($(e.target), link);
                                    t.canSuggest = false;
                                }
                            } else {
                                $('.history').each(function(i) {
                                    $(this).remove();
                                });
                            }

                        } else {
                            //if addressbar text is empty, clear all items
                            $('.history').each(function(i) {
                                $(this).remove();
                            });
                        }
                        //select first item from suggestions box
                        var first = $('li');
                        first.removeClass('selected');
                        first.first().addClass("selected");

                    },
                    complete: function() {
                        //load suggestions from Google
                        if (inputText != "" || inputText != null || typeof inputText !== "undefined") {
                            $.ajax({
                                type: "GET",
                                url: "http://google.com/complete/search?client=firefox&q=" + inputText,
                                success: function(data) {
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
                                    $.each(links, function(i, el) {
                                        if ($.inArray(el, uniqueLinks) === -1)
                                            uniqueLinks.push(el);
                                        }
                                    );
                                    //sort array by length
                                    uniqueLinks.sort(function(a, b) {
                                        return a.length - b.length;
                                    });
                                    //limit array length to 3
                                    if (uniqueLinks.length > 3) {
                                        uniqueLinks.length = 3;
                                    }
                                    var finalLength = uniqueLinks.length;
                                    if (finalLength > 3) {
                                        finalLength = 3;
                                    }
                                    if (finalLength < 0) {
                                        finalLength = 0;
                                    }
                                    //append missing items
                                    while ($('.internet').length < finalLength) {
                                        var s = $('<li data-ripple-color="#444" class="suggestions-li ripple internet" link=""></li>').appendTo($(t.refs.suggestions));
                                        s.click(function(e) {
                                            webview.loadURL("http://www.google.com/search?q=" + $(this).attr('link'));
                                        });
                                        s.mousedown(function(e) {
                                            //TODO: make ripple
                                        });
                                        s.mouseover(function() {
                                            $('.suggestions-li').removeClass("selected");
                                            $(this).addClass("selected");
                                            e.target.value = $(this).attr('link')
                                        });
                                    }
                                    //remove excess items
                                    while ($('.internet').length > finalLength) {
                                        $('.internet').first().remove()
                                    }
                                    //change each item content to new link from array
                                    $('.internet').each(function(i) {
                                        $(this).html(uniqueLinks[i]);
                                        $(this).attr('link', uniqueLinks[i]);
                                    })

                                }
                            });
                        }
                    }
                });
            }
        }
    }
    render() {
        return (
            <div ref="suggestionsWindow" onClick={() => this.handleClick(this)} className="suggestions-window">
                <ul ref="suggestions" className="suggestions"></ul>
            </div>
        )
    }
}
