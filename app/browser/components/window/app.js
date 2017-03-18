import React from 'react';
import ReactDOM from 'react-dom';
import TabBar from '../tabs/tabbar';
import Page from '../tabs/page';
import Titlebar from './titlebar';

import '../../../resources/browser/scss/app.scss';

export default class App extends React.Component {
    constructor() {
        super();
        //global properties
        this.state = {
            pagesToCreate: []
        };
    }
    /*
    lifecycle
    */
    componentDidMount() {
        /*var _args = remote.getGlobal('start').args;
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
        }*/
        var self = this;
        /*if (remote.getGlobal('start').file != false) {
            _url = "file:///" + remote.getGlobal('start').file;
        }*/
        document.addEventListener('keyup', function(e) {
            //CTRL + T
            if (e.ctrlKey && e.keyCode == 84) {
                //eslf.addTab();
            }
        }, false);
        setTimeout(function() {
            self.refs.tabbar.addTab();
        }, 1);
    }
    /*
    * closes window
    */
    close() {
        currentWindow.close();
    }
    /*
    * maximizes / restores window
    */
    maximizeOrRestore() {
        if (currentWindow.isMaximized()) {
            //restore window
            currentWindow.unmaximize();
        } else {
            //maximize window
            currentWindow.maximize();
        }
    }
    /*
    * minimizes / restores window
    */
    minimizeOrRestore() {
        if (currentWindow.isMinimized()) {
            //restore window
            currentWindow.restore();
        } else {
            //minimize window
            currentWindow.minimize();
        }
    }
    /*
    * adds page to render queue
    * @param1 {function} getTabFunction
    */
    addPage = (getTabFunction) => {
        this.setState((p) => {
            p.pagesToCreate.push(getTabFunction);
            return {pagesToCreate: p.pagesToCreate};
        });
    }
    /*
    * gets app
    * @return {App}
    */
    getApp = () => {
        return this;
    }

    render() {
        var self = this;

        return (
            <div>
                <Titlebar getApp={this.getApp} ref="titlebar">
                    <TabBar getApp={this.getApp} ref="tabbar"></TabBar>
                </Titlebar>
                {
                    self.state.pagesToCreate.map((object, i) => {
                        return <Page key={i} getTab={object} getApp={self.getApp}></Page>
                    })
                }
            </div>
        )
    }
}
