'use babel';
import React from 'react';
import ReactDOM from 'react-dom';
//import TabBar from '../tabs/tabbar';
//import Page from './page';
import Titlebar from './titlebar';

import '../../../resources/browser/scss/app.scss';

export default class App extends React.Component {
    constructor() {
        super();
        //global properties
        this.defaultOptions = {
            url: 'wexond://newtab/',
            select: true
        };
        this.state = {
            pagesToCreate: [],
            tabsToCreate: []
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
        var t = this;
        /*if (remote.getGlobal('start').file != false) {
            _url = "file:///" + remote.getGlobal('start').file;
        }*/
        document.addEventListener('keyup', function(e) {
            //CTRL + T
            if (e.ctrlKey && e.keyCode == 84) {
                t.addTab();
            }
        }, false);
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
    * adds tab to render queue
    * @param1 {Function} getPage
    */
    addTab = (options = this.defaultOptions) => {
        this.setState((p) => {
            p.tabsToCreate.push(options);
            return {tabsToCreate: p.tabsToCreate};
        });
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
    /*
    * gets titlebar
    * @return {Titlebar}
    */
    getTitlebar = () => {
        return this.refs.titlebar;
    }
    /*
    * gets tabbar
    * @return {TabBar}
    */
    getTabBar = () => {
        return this.refs.tabbar;
    }
    /*
    * returns array of tabs to create
    * @return {Array}
    */
    getTabsToCreate = () => {
        return this.state.tabsToCreate;
    }

    render() {
        var t = this;
        /*return (
            <div>
                <Titlebar getApp={this.getApp} ref="titlebar">
                    <TabBar getApp={this.props.getApp} ref="tabbar"></TabBar>
                </Titlebar>
                {
                    this.state.tabsToCreate.map(function(object, i) {
                        return <Tab ref={(tab) => tabs.push(tab)} key={i} data={object}></Tab>;
                    })
                }
            </div>
        );*/
        return (
            <div>
                <Titlebar getApp={this.getApp} ref="titlebar">

                </Titlebar>
            </div>
        )
    }
}
