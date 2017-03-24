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
        var self = this;
        var browserMenu = new BrowserWindow(
            {
                width: 300,
                height: 400,
                frame: false,
                resizable: false,
                transparent: true,
                child: currentWindow,
                thickFrame: false
            }
        );
        if (process.env.ENV == 'dev') {
            browserMenu.webContents.openDevTools();
        }
        browserMenu.hide();
        browserMenu.loadURL('file://' + __dirname + '/menu/index.html');
        browserMenu.on('blur', function() {
            browserMenu.hide();
        });

        setTimeout(function() {
            self.refs.tabbar.addTab();
        }, 1);

        document.addEventListener('keyup', function(e) {
            //CTRL + T
            if (e.ctrlKey && e.keyCode == 84) {
                self.getTabBar().addTab();
            }
        }, false);
        window.addEventListener('resize', function() {
            for (var i = 0; i < tabs.length; i++) {
                if (tabs[i].selected) {
                    tabs[i].getPage().resize();
                }
            }
        });

        window.addEventListener('contextmenu', function(e) {
            if (e.target.tagName === 'WEBVIEW') {
                browserMenu.setPosition(e.pageX, e.pageY + browserMenu.getBounds().height / 2);
                browserMenu.show();
            }
        });
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
    /*
    * gets tabbar
    * @return {TabBar}
    */
    getTabBar = () => {
        return this.refs.tabbar;
    }
    /*
    * gets browser menu
    * @return {BrowserMenu}
    */
    getBrowserMenu = () => {
        return this.refs.menu;
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
