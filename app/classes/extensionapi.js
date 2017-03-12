console.log(tabs);

class ExtensionAPI {
    constructor(tab, extensionWebview) {
        this.currentTab = tab;
        this.currentPage = tab.getPage();
        this.extensionWebview = extensionWebview;

        var t = this;

        this.extensionWebview.addEventListener('ipc-message', function(e) {
            /*
            * adds event to webview related to passed tab
            * @param1 {Object}
                * tab
                * event
            */
            if (e.channel == 'webviewaddevent') {
                console.log(e.args[0]);
                var page = t.getPageForTab(e.args[0].tab);
                page.getWebView().addEventListener(e.args[0].event, handleEvent);
            }
            /*
            * removes event to webview related to passed tab
            * @param1 {Object}
                * tab
                * event
            */
            if (e.channel == 'webviewremoveevent') {
                var page = t.getPageForTab(e.args[0].tab);
                page.getWebView().removeEventListener(e.args[0].event, handleEvent);
            }
            /*
            * gets tabs array transformed to IPC friendly array
            * @return {Object}
            */
            if (e.channel == 'gettabs') {
                var tempTabs = [];
                for (var i = 0; i < tabs.length; i++) {
                    var tab = t.prepareIPCTab(tabs[i]);
                    tempTabs.push(tab);
                }
                t.extensionWebview.send('gettabs', tempTabs);
            }
            /*
            * gets tab related to current extension and transformed to IPC friendly object
            * @return {Object}
            */
            if (e.channel == 'getcurrenttab') {
                var tab = t.prepareIPCTab(t.currentTab);
                tab.current = true;
                t.extensionWebview.send('getcurrenttab', tab);
            }
        });
        function handleEvent(e) {
            t.extensionWebview.send(e.type);
        }
    }
    /*
    * sends to extension dispose alert
    */
    dispose() {
        this.extensionWebview.send('dispose');
    }
    /*
    * reloads extensions
    */
    reload() {
        this.dispose();
        this.extensionWebview.reload();
    }
    /*
    * transforms tab to IPC friendly object
    * @return {Object}
    */
    prepareIPCTab(realTab) {
        return {
            background: realTab.background,
            foreground: realTab.foreground,
            title: realTab.getTitle(),
            favicon: realTab.getFaviconURL(),
            selected: realTab.isSelected(),
            index: realTab.getStaticIndex()
        };
    }
    /*
    * gets page related to tab
    * @param1 {Object} tab
    */
    getPageForTab(tab) {
        if (tab.current) {
            return this.currentPage;
        } else {
            for (var i = 0; i < tabs.length; i++) {
                if (tab.index == tabs[i].getStaticIndex()) {
                    return tabs[i].getPage();
                }
            }
        }
    }
}
