const {app} = require('electron').remote, {ipcRenderer} = require('electron');
var historyPath = app.getPath('userData') + '/userdata/history.json',
    newTabDataPath = app.getPath('userData') + '/userdata/bookmarks.json',
    extensionsPath = app.getPath('userData') + '/userdata/extensions',
    userdataPath = app.getPath('userData') + '/userdata',
    remote = require('electron').remote,
    fs = require('fs'),
    os = require('os'),
    env = "s";

global.getHistoryData = function() {
    return JSON.parse(fs.readFileSync(historyPath));
}

global.colorBrightness = function(color) {
    color = color.replace('#', '');
    var c_r = parseInt(color.substr(0, 2),16);
    var c_g = parseInt(color.substr(2, 2),16);
    var c_b = parseInt(color.substr(4, 2),16);
    return ((c_r * 299) + (c_g * 587) + (c_b * 114)) / 1000;
}

global.getNewtabData = function() {
    return JSON.parse(fs.readFileSync(newTabDataPath));
}

global.resetNewtabData = function() {
    var _json = {
        "bookmarks": []
    }
    _json = JSON.stringify(_json);
    global.saveNewtabData(_json);
}

global.newTabAddCard = function(_name, _url, _icon, _color, _fontColor, callback) {
    var _json = global.getNewtabData();
    var brightness = global.colorBrightness(_color);
    var _ripplecolor = '#000';
    if (brightness < 125) {
        _ripplecolor = '#fff';
    }
    _json.bookmarks.push({
        "name": _name.toString(),
        "url": _url.toString(),
        "icon": _icon.toString(),
        "color": _color.toString(),
        "fontColor": _fontColor.toString(),
        "rippleColor": _ripplecolor
    })
    _json = JSON.stringify(_json);
    global.saveNewtabData(_json, function() {
        if (global.isFunction(callback)) {
            callback();
        }
    });
}

global.saveNewtabData = function(json, callback) {
    fs.writeFile(newTabDataPath, json, function(err) {
        if (err) {
            return console.log(err);
        }
        if (global.isFunction(callback)) {
            callback();
        }
    });
}

global.newTabRemoveCard = function(_id, callback) {
    try {
        var _json = global.getNewtabData();
        _id = parseInt(_id);
        _json.newtabdata.splice(_id, 1);
        _json = JSON.stringify(_json);
        global.saveNewtabData(_json, function() {
            if (global.isFunction(callback)) {
                callback();
            }
        });
    } catch (err) {
        console.log(err);
        global.resetNewtabData();
    }
}

global.isFunction = function(f) {
    var g = {};
    return f && g.toString.call(f) === '[object Function]';
}

ipcRenderer.on('env', function(e, data) {
    env = data;
});

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
