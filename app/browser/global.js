//electron's stuff and things
const {remote, clipboard, ipcRenderer} = require('electron');
const BrowserWindow = remote.BrowserWindow;
const {Menu, MenuItem} = remote;
const app = remote.app;
const currentWindow = remote.getCurrentWindow();
//global paths to browser's storage
const appData = app.getPath('userData');
const userData = appData + '/userdata';
const historyPath = userData + '/history.json';
const extensionsPath = userData + '/extensions';
const bookmarksDataPath = userData + '/bookmarks.json';
//other requires
const nodeDir = require('node-dir');
const fs = require('fs');
//animations
var tabsAnimationsData = {
    hoverTransparency: 0.1,
    closeTabSpring: durationToSpring(0.3),
    addTabSpring: durationToSpring(0.3),
    setPositionsSpring: durationToSpring(0.3),
    setWidthsSpring: durationToSpring(0.3)
};
var barAnimationsData = {
  opacitySpring: durationToSpring(0.3),
  topSpring: durationToSpring(0.3),
  suggestionsOpacitySpring: durationToSpring(0.3)
};
//tabs
var tabs = [];
const tabsData = {
    pinnedTabWidth: 32,
    maxTabWidth: 190
}

function checkFiles() {
    //check if directory called userdata exists
    if (!fs.existsSync(userData)) {
        fs.mkdir(userData);
    }
    //check if directory called extensions exists
    if (!fs.existsSync(extensionsPath)) {
        fs.mkdir(extensionsPath);
    }
    //check if file called history.json exists
    if (!fs.existsSync(historyPath)) {
        fs.writeFile(historyPath, '{"history":[]}');
    }
    //check if file called bookmarks.json exists
    if (!fs.existsSync(bookmarksDataPath)) {
        fs.writeFile(bookmarksDataPath, '{"bookmarks":[]}');
    }
}

function durationToSpring(w, o = 0) {
    const s = o <= 0
        ? 1 - o
        : 1 / Math.sqrt(1 + Math.pow(2 * Math.PI / Math.log(1 / (o * o)), 2));

    const ks = (2 * Math.PI / w) / Math.max(Math.sqrt(1 - s * s), 0.5);
    const c = 2 * ks * s;
    return {
        stiffness: ks * ks,
        damping: c
    };
}

if (process.env.ENV == 'dev') {
    remote.getCurrentWindow().webContents.openDevTools();
}

console.log(process.versions.electron);
