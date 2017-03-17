//import animation easing
import {Expo} from 'gsap';
//electron's stuff and things :)
const {remote, clipboard} = require('electron');
const {Menu, MenuItem} = remote;
const app = remote.app;
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
    animationDuration: 0.3,
    animationEasing: Expo.easeOut,
    hoverTransparency: 0.1
};
//tabs
var tabs = [];

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

if (process.env.ENV == 'dev') {
    remote.getCurrentWindow().webContents.openDevTools();
}

console.log(process.versions.electron);
