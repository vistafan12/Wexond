/*
* class API(tab, parent)
* tab - React object of tab
* parent - parent window
*/
class API {
    constructor(tab, parent) {
        this.tab = new Tab(tab, this),
        this.instance = new Instance(this.tab, this)
        this.webview = new WebView(tab.state.page.getWebView(), instance, this)
    }

    //global methods that manage whole window

    /*
    * removes all event listeners
    */
    dispose() {

    }
}
/*
* class WebView(webview, instance)
* instance - instance class
* webview - DOM node of webview
*/
class WebView {
    constructor(webview, instance, api) {
        //event listeners and methods for webview
    }
}
/*
* class Instance(tab)
* tab - tab class
*/
class Instance {
    constructor(tab, api) {
        //event listeners and methods for instance
    }
}
/*
* class Tab(tab)
* tab - React object of tab
*/
class Tab {
    constructor(tab, api) {
        //event listeners and methods for tab
    }
}
