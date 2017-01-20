var {app, BrowserWindow} = require('electron'),
    path = require('path');
let mainWindow = null;
app.on('window-all-closed', () => {
    if (process.platform != 'darwin') {
        app.quit();
    }
});

app.on('ready', () => {
    mainWindow = new BrowserWindow({width: 800, height: 600, frame: false, minWidth: 300, minHeight: 430});
    mainWindow.loadURL('file://' + __dirname + '/index.html');
    mainWindow.setMenu(null);

    if (process.env.NODE_ENV == 'dev')
        mainWindow.webContents.openDevTools()

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
});
