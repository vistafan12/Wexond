const {app} = require('electron').remote, {ipcRenderer} = require('electron');
var historyPath = app.getPath('userData') + '/userdata/history.json',
    bookmarksPath = app.getPath('userData') + '/userdata/bookmarks.json',
    extensionsPath = app.getPath('userData') + '/userdata/extensions',
    userdataPath = app.getPath('userData') + '/userdata',
    remote = require('electron').remote,
    fs = require('fs'),
    os = require('os'),
    env = "s";

ipcRenderer.on('env', function(e, data) {
    env = data;
});

global.getHistoryData = function() {
    return JSON.parse(fs.readFileSync(historyPath));
}

global.getBookmarksData = function() {
    return JSON.parse(fs.readFileSync(bookmarksPath));
}

global.resetBookmarksData = function() {
    var _json = {
        "bookmarks": []
    }
    _json = JSON.stringify(_json);
    global.saveBookmarksData(_json);
}

global.saveBookmarksData = function(json, callback) {
    fs.writeFile(bookmarksPath, json, function(err) {
        if (err) {
            return console.log(err);
        }
        if (global.isFunction(callback)) {
            callback();
        }
    });
}

global.isFunction = function(f) {
    var g = {};
    return f && g.toString.call(f) === '[object Function]';
}

global.getEnv = function() {
    return env;
}

global.saveHistory = function(json) {
    fs.writeFile(historyPath, json, function(err) {
        if (err) {
            return console.log(err);
        }
    });
}

global.removeHistory = function(callback = function() {}) {
    fs.unlink(historyPath, callback);
}

document.addEventListener("click", function(e) {
    if (e.which == 2) {
        if (e.target.tagName == "A") {
            ipcRenderer.sendToHost("scroll", e.target.href);
        }
    }
    if (e.which == 1) {
        ipcRenderer.sendToHost("LMB");
    }
});
