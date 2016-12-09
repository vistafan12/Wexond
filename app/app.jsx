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
        return (
            <div>
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
