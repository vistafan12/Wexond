import React from 'react';
import ReactDOM from 'react-dom';
import TabBar from '../tabs/tabbar';
import Page from '../tabs/page';
import Titlebar from './titlebar';
import Bar from '../navbar/bar';

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
                tabs[i].getPage().resize();
            }
        });

        window.addEventListener('contextmenu', function(e) {
            if (e.target.tagName === 'WEBVIEW') {
                currentWindow.getChildWindows()[0].send('browser-menu:show-animation', e.screenX, e.screenY);
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
    /*
    * gets bar
    * @return {Bar}
    */
    getBar = () => {
        return this.refs.bar;
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
                <Bar ref="bar"></Bar>
            </div>
        )
    }
}
