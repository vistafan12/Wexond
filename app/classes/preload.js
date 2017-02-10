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

global.saveNewtabData = function(json) {
    fs.writeFile(newTabDataPath, json, function(err) {
        if (err) {
            return console.log(err);
        }
    });
}

global.newTabAddCard = function(id, name, url, icon, color, fontColor) {
    var _json = global.getNewtabData();
    _json.newtabdata.push(
        {
            "id": id.toString()
            /*"name": '"' + name + '"',
            "url": '"' + url + '"',
            "icon": '"' + icon + '"',
            "color": '"' + color + '"',
            "fontColor": '"' + fontColor + '"'*/
        }
    );
    _json = JSON.stringify(_json);
    global.saveNewtabData(_json);
}

global.newTabRemoveCard = function(id) {
    var _json = global.getNewtabData();

/*    for(var i = 0; i < _json.newtabdata.length; i++) {
        console.log(_json.newtabdata[i].id);
    }*/
    delete _json.newtabdata[0];
    console.log(_json);
}

global.resetNewtabData = function() {
    var _json = {
        "newtabdata": [

        ]
    }
    _json = JSON.stringify(_json);
    global.saveNewtabData(_json);
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
