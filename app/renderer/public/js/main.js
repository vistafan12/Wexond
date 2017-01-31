const {remote, clipboard} = require('electron');
const {Menu, MenuItem, globalShortcut} = remote;

var app = remote.app,
    appData = app.getPath('userData'),
    userData = appData + '/userdata',
    historyPath = userData + '/history.json',
    extensionsPath = userData + '/extensions',
    isThere = require('is-there'),
    dir = require('node-dir'),
    fs = require('fs'),
    tabsAnimationDuration = 0.3,
    tabsAnimationEasing,
    tabsHoverTransparency = 0.1,
    tabs = [];

function checkFiles() {
    //check if directory called userdata exists
    if (!isThere(userData)) {
        fs.mkdir(userData);
    }
    //check if directory called extensions exists
    if (!isThere(extensionsPath)) {
        fs.mkdir(extensionsPath);
    }
    //check if file called history.json exists
    if (!isThere(historyPath)) {
        fs.writeFile(historyPath, '{"history":[]}');
    }
}

//unregister all shortcuts to prevent errors
globalShortcut.unregisterAll();

if (process.env.ENV == 'dev') {
    remote.getCurrentWindow().webContents.openDevTools();
}
