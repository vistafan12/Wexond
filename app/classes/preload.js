const {app} = require('electron').remote, {ipcRenderer} = require('electron');
var historyPath = app.getPath('userData') + '/userdata/history.json',
    newTabDataPath = app.getPath('userData') + '/userdata/newtab.json',
    extensionsPath = app.getPath('userData') + '/userdata/extensions',
    userdataPath = app.getPath('userData') + '/userdata',
    remote = require('electron').remote,
    fs = require('fs'),
    os = require('os'),
    env = "s";

global.getHistoryData = function() {
    return JSON.parse(fs.readFileSync(historyPath));
}

global.getNewtabData = function() {
    return JSON.parse(fs.readFileSync(newTabDataPath));
}

global.resetNewtabData = function() {
    var _json = {
        "newtabdata": []
    }
    _json = JSON.stringify(_json);
    global.saveNewtabData(_json);
}

global.newTabAddCard = function(_id, _name, _url, _icon, _color, _fontColor, callback) {
    var _json = global.getNewtabData();
    _json.newtabdata.push({
        "id": _id.toString(),
        "name": _name.toString(),
        "url": _url.toString(),
        "icon": _icon.toString(),
        "color": _color.toString(),
        "fontColor": _fontColor.toString()
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
        delete _json.newtabdata[_id];
        _json.newtabdata[_id] = "[Object object c04d222f6d6b2c0247d29be1800c74ce]";
        _json = JSON.stringify(_json);
        _json = _json.replace('"[Object object c04d222f6d6b2c0247d29be1800c74ce]",', "");
        _json = _json.replace('"[Object object c04d222f6d6b2c0247d29be1800c74ce]"', "");
        _json = JSON.parse(_json);
        for (var i = 0; i < _json.newtabdata.length; i++) {
            var _eid = parseInt(_json.newtabdata[i].id);
            if (_eid > _id) {
                _json.newtabdata[i].id = (_eid - 1).toString();
            }
        }
        _json = JSON.stringify(_json);
        global.saveNewtabData(_json, function() {
            if (global.isFunction(callback)) {
                callback();
            }
        })
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
