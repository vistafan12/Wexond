const {app} = require('electron').remote,
      {ipcRenderer} = require('electron');
var historyPath = app.getPath('userData') + '/userdata/history.json',
    extensionsPath = app.getPath('userData') + '/userdata/extensions',
    userdataPath = app.getPath('userData') + '/userdata',
    remote = require('electron').remote,
    fs = require('fs'),
    os = require('os');

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

document.addEventListener("click", function(e) {
  if (e.which == 2) {
    if (e.target.tagName == "A") {
      ipcRenderer.sendToHost("scroll", e.target.href);
    }
  }
});
