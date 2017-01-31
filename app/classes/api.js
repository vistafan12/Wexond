/*
* class API(tab, parent)
* tab - React object of tab
* parent - parent window
*/
class API {
    constructor(tab, parent) {
        var instance = tab.page.getPage(),
            webview = tab.page.getWebView();

        this.webviews = [];
        this.tab = new Tab(tab, this);
        this.page = new Page(tab.page.getPage(), this);
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
    requestUrl(url, callback) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", url, false );
        xmlHttp.send(null);
        return xmlHttp.responseText;
    }
    /*
    * return boolen, client is offline or online
    */
    isOnline() {
        return navigator.onLine;
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
        //event listeners and methods for instance
        this.page = page;
    }
    /*
    * returns app
    */
    getApp() {
        return this.page.props.getApp();
    }
    /*
    * returns tabbar in app
    */
    getTabbar() {
        return this.page.getTabbar();
    }
    /*
    * returns titlebar
    */
    getTitlebar() {
        return this.page.getTitlebar();
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
