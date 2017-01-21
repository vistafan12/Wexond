var {app, BrowserWindow} = require('electron'),
    protocol = require('electron').protocol,
    remote = require('electron').remote,
    path = require('path');

let mainWindow;

app.on('window-all-closed', () => {
    if (process.platform != 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});

function createWindow() {
    mainWindow = new BrowserWindow({width: 900, height: 700, frame: false, minWidth: 300, minHeight: 430});
    mainWindow.loadURL('file://' + __dirname + '/../app/renderer/public/index.html');
    mainWindow.setMenu(null);

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
    mainWindow.on('unresponsive', function () {

    });
}
process.on('uncaughtException', function () {

});

protocol.registerStandardSchemes(['wexond']);
app.on('ready', function () {
    protocol.registerFileProtocol('wexond', (request, callback) => {
        var url = request.url.substr(8);
        var lastChar = url.substr(url.length - 1);
        var s = url.split("/");
        if (lastChar != "/") {
            url = url.replace(s[0], "");
        }
        if (lastChar == "/") {
            url = url.substring(0, url.length - 1);
            url += ".html";
        }
        callback({
            path: path.normalize(`${__dirname}/../app/renderer/public/${url}`)
        });
    }, (error) => {
        if (error) console.error('Failed to register protocol');
    });
    createWindow();
});

var client = require('electron-connect').client;
client.create(mainWindow);
