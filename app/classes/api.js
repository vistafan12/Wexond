/*
* class API(tab, parent)
* tab - React object of tab
* parent - parent window
*/
class API {
    constructor(tab, parent) {
        var webview = tab.getPage().getWebView();

        this.webviews = [];

        this.tab = new Tab(tab, this);
        this.page = new Page(tab.getPage(), this);
        this.webview = new WebView(webview, this);

        this.parent = parent;
    }

    //global methods that manage whole window

    /*
    * removes all event listeners
    */
    dispose() {
        for (var i = 0; i < this.webviews.length; i++) {
            this.webviews[i].destroy();
        }
    }
    /*
    * sets titlebar color
    */
    setTitlebarColor(color) {
        $(this.page.getTitlebar().refs.titlebar).css('background-color', color);
    }
    /*
    * gets titlebar color
    */
    getTitlebarColor() {
        return $(this.page.getTabbar().refs.tabBarContainer).css('background-color');
    }
    /*
    * returns string - response from website
    */
    requestUrl(url) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", url, false);
        xmlHttp.send(null);
        return xmlHttp.responseText;
    }
    /*
    * return boolen, client is offline or online
    */
    isOnline() {
        return navigator.onLine;
    }
    /*
    * get start
    */
    getStart() {
        return remote.getGlobal('start');
    }
    /*
    * get start args
    */
    getStartArgs() {
        return remote.getGlobal('start').args;
    }
    /*
    * get opened file (default false)
    */
    getOpenedFile() {
        return remote.getGlobal('start').file;
    }
}
/*
* class WebView(webview, api)
* webview - Object DOM node of webview
* api - Object api
*/
class WebView {
    constructor(webview, api) {
        //event listeners and methods for webview
        api.webviews.push(this);
    }
    /*
    * destroys webview
    */
    destroy() {}
}
/*
* class Instance(page, api)
* page - Object page react instance
* api - Object api
*/
class Page {
    constructor(page, api) {
        this.page = page;
        //event listeners and methods for instance
    }
    /*
    * returns app
    */
    getApp() {
        return this.page.props.getApp();
    }
}
/*
* class Tab(tab, api)
* tab - React object of tab
* api - Object api
*/
class Tab {
    constructor(tab, api) {
        //event listeners and methods for tab
    }
}
