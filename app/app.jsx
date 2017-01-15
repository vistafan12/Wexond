'use babel';
import React from 'react';
import ReactDOM from 'react-dom';
import Page from './components/page/page.jsx'
import Titlebar from './components/titlebar.jsx'

class App extends React.Component {
    constructor() {
        super()
        //binds
        this.addTab = this.addTab.bind(this)
        this.addPage = this.addPage.bind(this)
        this.getTabsToCreate = this.getTabsToCreate.bind(this)
        this.getApp = this.getApp.bind(this)
        //state
        this.state = {
            pagesToCreate: [],
            tabsToCreate: []
        }
        //properties
        this.defaultURL = 'about:blank'
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
    * adds page to render queue
    * options (optional) - Object {url} default: {url: this.defaultURL}
    */
    addPage(options = {
        url: this.defaultURL
    }) {
        var state = this.state
        state.pagesToCreate.push(options)
        this.setState(state)
    }
    /*
    * gets tabs render queue
    * returns array of tabs to create
    */
    getTabsToCreate() {
        return this.state.tabsToCreate
    }
    /*
    * returns this
    */
    getApp() {
        return this
    }

    render() {
        var t = this

        return (
            <div>

                <Titlebar getApp={t.getApp} ref="titlebar"></Titlebar>

                {this.state.pagesToCreate.map(function(object, i) {
                    return <Page index={i} getApp={t.getApp} key={i} url={object.url}></Page>
                })
}

            </div>
        )
    }
}

window.onload = function() {
    ReactDOM.render(< App / >, document.getElementById("app"));
}
