class WebView {
    constructor() {
        this.events = [];
    }
    addEventListener(event, callback) {
        var eventObj = {event: event, callback: callback};
        ipcRenderer.sendToHost("webviewaddevent", eventObj);
        ipcRenderer.on(event, callback);
        this.events.push(eventObj);
    }
    removeEventListener(event, callback) {
        var eventObj = {event: event, callback: callback};
        ipcRenderer.sendToHost("webviewremoveevent", eventObj);
        ipcRenderer.removeListener(event, callback);
        this.events.splice(this.events.indexOf(eventObj), 1);
    }
    dispose() {
        for (var i = 0; i < this.events.length; i++) {
            this.removeEventListener(this.events[i].event, this.events[i].callback);
        }
    }
}

var {ipcRenderer} = require('electron');

global.webview = new WebView();

ipcRenderer.on('dispose', function() {
    global.webview.dispose();
});
