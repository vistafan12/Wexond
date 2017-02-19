'use babel';
import React from 'react';
import ReactDOM from 'react-dom';
import Page from './page.js';
import Titlebar from './titlebar.js';
require('../../public/global/js/main.js');

export default class App extends React.Component {
    constructor() {
        super();
        //global properties
        this.defaultURL = 'wexond://newtab/';
        this.defaultOptions = {url: this.defaultURL, select: true};
        this.state = {
            pagesToCreate: [],
            tabsToCreate: []
        };
    }
    /*
    lifecycle
    */
    componentDidMount() {
        var _args = remote.getGlobal('start').args;
        for (var i = 0; i < _args.length; i++) {
            _args[i] = _args[i].replace(/\\/g, "/");
            try {
                var isdir = fs.lstatSync(_args[i]).isFile();
                if (isdir) {
                    //get file type
                    var _type = _args[i].split('.').pop();
                    if (_type != "exe") {
                        if (_args[i] != "build/main.bundle.js") {
                            if (_args[i] != null || _args[i] != undefined) {
                                remote.getGlobal('start').file = _args[i];
                            }
                        }
                    }
                }
            } catch (err) {}
        }
        var t = this;
        var _url = this.defaultURL;
        if (remote.getGlobal('start').file != false) {
            _url = "file:///" + remote.getGlobal('start').file;
        }
        this.addPage({url: _url, select: true});
        globalShortcut.register('CmdOrCtrl+T', () => {
            if (remote.getCurrentWindow().isFocused())
                t.addPage();
            }
        );
    }
    /*
    * adds tab to render queue
    * pageObj - page object
    */
    addTab = (pageObj) => {
        var state = this.state;
        state.tabsToCreate.push(pageObj);
        this.setState(state);
    }
    /*
    * adds page to render queue
    * options (optional) - Object {url} default: {url: this.defaultURL, select: true}
    */
    addPage = (options = this.defaultOptions) => {
        var state = this.state;
        state.pagesToCreate.push(options);
        this.setState(state);
    }
    /*
    * returns this object
    */
    getApp = () => {
        return this;
    }

    render() {
        var t = this;
        return (
            <div>
                <Titlebar getApp={this.getApp} ref="titlebar"></Titlebar>

                {this.state.pagesToCreate.map(function(object, i) {
                    return <Page index={i} getApp={t.getApp} key={i} select={object.select} url={object.url}></Page>;
                })}
            </div>
        );
    }
}
