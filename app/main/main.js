var {app, BrowserWindow, protocol} = require('electron'),
    path = require('path');
let mainWindow = null;
app.on('window-all-closed', () => {
    if (process.platform != 'darwin') {
        app.quit();
    }
});

app.on('ready', () => {
    mainWindow = new BrowserWindow({width: 900, height: 700, frame: false, minWidth: 300, minHeight: 430});
    mainWindow.loadURL('file://' + __dirname + '/../app/renderer/public/index.html');
    mainWindow.setMenu(null);

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
    mainWindow.on('unresponsive', function () {

    });
});
process.on('uncaughtException', function () {

});

protocol.registerStandardSchemes(['webexpress'])
app.on('ready', function () {
    protocol.registerFileProtocol('webexpress', (request, callback) => {
        var url = request.url.substr(13)
        var lastChar = url.substr(url.length - 1)
        var s = url.split("/");
        if (lastChar != "/") {
            url = url.replace(s[0], "")
        }
        if (lastChar == "/") {
            url = url.substring(0, url.length - 1)
            url += ".html"
        }
        callback({
            path: path.normalize(`${__dirname}/${url}`)
        })
    }, (error) => {
        if (error) console.error('Failed to register protocol')
    })
    createWindow();
});
