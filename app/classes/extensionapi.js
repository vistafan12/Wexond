class ExtensionAPI {
    constructor(page, webview) {
        this.page = page;
        this.webview = webview;

        var t = this;

        webview.addEventListener('ipc-message', function(e) {
            if (e.channel == 'webviewaddevent') {
                t.page.getWebView().addEventListener(e.args[0].event, handleEvent);
            }
            if (e.channel == 'webviewremoveevent') {
                t.page.getWebView().removeEventListener(e.args[0].event, handleEvent);
            }
        });
        function handleEvent(e) {
            t.webview.send(e.type);
        }
    }

    dispose() {
        this.webview.send('dispose');
    }
}
