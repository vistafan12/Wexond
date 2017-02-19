/*
* class API(tab, parent)
* @param1 {Tab} tab
* @param2 {Window} parent
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
    * @param1 {String} color
    */
    setTitlebarColor(color) {
        this.page.getApp().getTitlebar().refs.titlebar.css('background-color', color);
    }
    /*
    * gets titlebar color
    * @return {String} - color
    */
    getTitlebarColor() {
        return this.page.getApp().getTabbar().refs.tabBarContainer.css('background-color');
    }
    /*
    * requests website
    * @return {String} - response text
    */
    requestUrl(url) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", url, false);
        xmlHttp.send(null);
        return xmlHttp.responseText;
    }
    /*
    * checks if user is online or offline
    * @return {Boolean}
    */
    isOnline() {
        return navigator.onLine;
    }
}
/*
* class WebView(webview, api)
* @param1 {DOMElement} webview
* @param2 {API} api
*/
class WebView {
    constructor(webview, api) {
        //event listeners and methods for webview
        api.webviews.push(this);
    }
    /*
    * destroys webview event listeners
    */
    destroy() {}
}
/*
* class Instance(page, api)
* @param1 {Page} page
* @param2 {API} api
*/
class Page {
    constructor(page, api) {
        this.page = page;
        //event listeners and methods for instance
    }
    /*
    * gets app
    * @return {ReactObject}
    */
    getApp() {
        return this.page.props.getApp();
    }
}
/*
* class Tab(tab, api)
* @param1 {Tab} tab
* @param2 {API} api
*/
class Tab {
    constructor(tab, api) {
        //event listeners and methods for tab
    }
}
