'use babel';
import React from 'react';
import ReactDOM from 'react-dom';
import TabBar from './components/tabs/tabbar.jsx'
import Page from './components/page/page.jsx'

class App extends React.Component {
    constructor() {
        super()
        //binds
        this.addTab = this.addTab.bind(this)
        this.addPage = this.addPage.bind(this)
        this.getTabsToCreate = this.getTabsToCreate.bind(this)
        //state
        this.state = {
            pagesToCreate: [],
            tabsToCreate: []
        }
    }
    /*
    lifecycle
    */
    componentDidMount() {
        this.addPage()
    }
    /*
    * adds tab to render queue
    * pageObj - page object
    */
    addTab(pageObj) {
        var state = this.state
        state.tabsToCreate.push(pageObj)
        this.setState(state)
    }
    /*
    * closes window
    */
    close() {
        remote.getCurrentWindow().close();
    }
    /*
    * maximizes / restores window
    */
    maximizeOrRestore() {
        if (remote.getCurrentWindow().isMaximized()) {
            //restore window
            remote.getCurrentWindow().unmaximize();
        } else {
            //maximize window
            remote.getCurrentWindow().maximize();
        }
    }
    /*
    * minimizes / restores window
    */
    minimizeOrRestore() {
        if (remote.getCurrentWindow().isMinimized()) {
            //restore window
            remote.getCurrentWindow().restore();
        } else {
            //minimize window
            remote.getCurrentWindow().minimize();
        }
    }
    /*
    * adds page to render queue
    */
    addPage() {
        var state = this.state
        state.pagesToCreate.push({url: "http://google.pl"})
        this.setState(state)
    }
    /*
    * gets tabs render queue
    * returns array of tabs to create
    */
    getTabsToCreate() {
        return this.state.tabsToCreate
    }

    render() {
        var t = this
        var closeStyle = {
          backgroundImage: 'url(img/controls/close-white.png)'
        };
        var maximizeStyle = {
          backgroundImage: 'url(img/controls/maximize-white.png)'
        };
        var minimizeStyle = {
          backgroundImage: 'url(img/controls/minimize-white.png)'
        };
        return (
            <div>
                <div className="draggable"></div>
                <div className="window-controls">
                    <div className="control" style={closeStyle} onClick={this.close}>
                    </div>
                    <div className="control" style={maximizeStyle} onClick={this.maximizeOrRestore}>
                    </div>
                    <div className="control" style={minimizeStyle} onClick={this.minimizeOrRestore}>
                    </div>
                </div>
                <TabBar addPage={() => this.addPage()} getTabsToCreate={() => this.getTabsToCreate()}></TabBar>
                {this.state.pagesToCreate.map(function(object, i) {
                    return <Page index={i} addTab={t.addTab} key={i} url={object.url}></Page>
                })
                }
            </div>
        )
    }
}

window.onload = function() {
    ReactDOM.render(< App / >, document.getElementById("app"));
}
