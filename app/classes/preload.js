var fs = require('fs'),
    os = require('os');
const {app} = require('electron').remote;
var historyPath = app.getPath('userData') + '/userdata/history.json',
    extensionsPath = app.getPath('userData') + '/userdata/extensions',
    userdataPath = app.getPath('userData') + '/userdata',
    ipcRenderer = require('electron'),
    remote = require('electron').remote;

document.addEventListener("click", function(e) {
  if (e.which == 2) {
    if (e.target.tagName == "A") {
      ipcRenderer.sendToHost("scroll", e.target.href);
    }
  }
});

global.getHistoryData = function() {
  return JSON.parse(fs.readFileSync(historyPath));
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
