/*
* class API(tab, parent)
* tab - React object of tab
* parent - parent window
*/
class API {
    constructor(tab, parent) {
        var instance = tab.instance,
            webview = tab.page.getWebView()

        this.webviews = []
        this.tab = new Tab(tab, this)
        this.instance = new Page(tab.page.getPage(), this)
        this.webview = new WebView(webview, this)
    }

    //global methods that manage whole window

    /*
    * removes all event listeners
    */
    dispose() {
        for (var i = 0; i < this.webviews.length; i++) {
            this.webviews[i].destroy()
        }
    }
    /*
    * sets titlebar color
    */
    setTitlebarColor(color) {
        $(this.instance.getTabbar().refs.tabBarContainer).css('background-color', color)
    }
    /*
    * gets titlebar color
    */
    getTitlebarColor() {
        return $(this.instance.getTabbar().refs.tabBarContainer).css('background-color')
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
        api.webviews.push(this)
    }
    /*
    * destroys webview
    */
    destroy() {

    }
}
/*
* class Instance(page, api)
* page - Object page react instance
* api - Object api
*/
class Page {
    constructor(page, api) {
        //event listeners and methods for instance
        this.page = page
    }
    /*
    * returns app
    */
    getApp() {
        return this.page.props.getApp()
    }
    /*
    * returns tabbar in app
    */
    getTabbar() {
        return this.page.props.getApp().refs.tabbar
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
