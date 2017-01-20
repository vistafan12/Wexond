var fs = require('fs');
var os = require('os');
const {ipcRenderer} = require('electron')
const {app} = require('electron').remote;
const remote = require('electron').remote

document.addEventListener("click", function(e) {
    if (e.which == 2) {

        if (e.target.tagName == "A") {
            ipcRenderer.sendToHost("scroll", e.target.href)
        }

    }
})
