const {app, BrowserWindow} = require('electron');
const protocol = require('electron').protocol;
const remote = require('electron').remote;
const path = require('path');

const protocolName = 'wexond';

let mainWindow;

let browserMenu;

/*
global events
*/
app.on('window-all-closed', () => {
    if (process.platform != 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});

process.on('uncaughtException', function (error) {
    console.log(error);
});

/*
* prepares browser window
*/
function createWindow() {
    mainWindow = new BrowserWindow({width: 900, height: 700, frame: false, minWidth: 300, minHeight: 430, show: false});
    mainWindow.loadURL('file://' + __dirname + '/app/resources/index.html');
    mainWindow.setMenu(null);

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    mainWindow.on('unresponsive', function () {});

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    browserMenu = new BrowserWindow(
        {
            width: 300,
            height: 500,
            frame: false,
            resizable: false,
            transparent: true,
            parent: mainWindow,
            thickFrame: false,
            skipTaskbar: true,
            alwaysOnTop: true,
            show: false
        }
    );
    browserMenu.loadURL('file://' + __dirname + '/app/resources/menu/index.html');

    browserMenu.setIgnoreMouseEvents(true);

    browserMenu.on('blur', function() {
        //browserMenu.send('browser-menu:hide-animation');
    });
    browserMenu.once('ready-to-show', () => {
        browserMenu.show();
    });

    if (process.env.ENV == 'dev') {
        mainWindow.webContents.openDevTools();
        browserMenu.webContents.openDevTools();
    }
}

/*
* creates protocol wexond://
*/
protocol.registerStandardSchemes([protocolName]);
app.on('ready', function () {
    protocol.registerFileProtocol(protocolName, (request, callback) => {
        var url = request.url.substr(protocolName.length + 3);
        var lastChar = url.substr(url.length - 1);
        var splitBySlash = url.split("/");
        if (lastChar != "/") {
            url = url.replace(splitBySlash[0], "");
        }
        if (lastChar == "/") {
            url += "index.html";
        }
        callback({
            path: path.normalize(`${__dirname}/../renderer/public/${url}`)
        });
    }, (error) => {
        if (error) console.error('Failed to register protocol');
    });
    createWindow();
});

global.start = {
    args: process.argv,
    file: false,
    env: process.env.ENV
};



/*
    HKEY_CLASSES_ROOT
    	.html
    		`OpenWithProgids
    			+Wexond.html (REG_SZ)
    	Wexond.html
    		`Application
    			+ApplicationCompany (REG_SZ) -> Nersent
    			+ApplicationDescription (REG_SZ) -> Search the internet
    			+ApplicationIcon(REG_SZ) -> C:\Users\{USER}\Desktop\Wexond\logo.ico
    		`DefaultIcon
    			Default (REG_SZ) -> C:\Users\{USER}\Desktop\Wexond\logo.ico
    		`shell
    			`open
    				`command
    					Default (REG_SZ) -> "C:\Users\{USER}\Desktop\Compiled\Wexond.exe" "1.0" "%1"
*/
