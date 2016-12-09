'use babel';
import React from 'react';

export default class Page extends React.Component {
    constructor() {
        super()
        //binds
        this.associateTab = this.associateTab.bind(this)
        this.getPage = this.getPage.bind(this)
        this.getWebView = this.getWebView.bind(this)
        this.removePage = this.removePage.bind(this)
        this.resize = this.resize.bind(this)
        //global properties
        this.tab = null
        //state
        this.state = {
            render: true
        }
    }
    /*
    * lifecycle
    */
    componentDidUpdate() {
        this.tab.setPage(this)
    }
    componentDidMount() {
        var t = this
        var pageObj = {
            getPage: this.getPage,
            getWebView: this.getWebView,
            associateTab: this.associateTab,
            removePage: this.removePage,
            resize: this.resize
        }
        this.props.addTab(pageObj)
        this.resize()
        window.addEventListener('resize', function() {
            t.resize()
        })
        this.refs.webview.addEventListener('page-title-updated', function(title) {
            t.tab.changeTitle(title.title)
        })
    }
    /*
    * disables page render
    */
    removePage() {
        var newState = this.state
        newState.render = false
        this.setState(newState)
    }
    /*
    * gets page ref
    * returns page ref
    */
    getPage() {
        return this.refs.page
    }
    /*
    * gets WebView ref
    * returns WebView ref
    */
    getWebView() {
        return this.refs.webview
    }
    /*
    * sets this.tab to new value
    * tab - tab object
    */
    associateTab(tab) {
        this.tab = tab
    }
    /*
    * resizes WebView to match parent width and height
    */
    resize() {
        this.refs.webview.style.height = window.innerHeight - 32 + 'px'
        this.refs.webview.style.width = window.innerWidth + 'px'
    }
    render() {
        var el = (
            <div ref="page">
                <webview ref="webview" src={this.props.url}></webview>
            </div>
        )
        if (this.state.render) {
            return el
        }
        return null
    }
}
