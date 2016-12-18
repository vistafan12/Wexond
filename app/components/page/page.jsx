'use babel';
import React from 'react';
import Bar from '../bar.jsx'
import Suggestions from '../suggestions.jsx'
import Storage from '../../classes/storage.js'
import Extensions from '../../classes/extensions.js'

export default class Page extends React.Component {
    constructor() {
        super()
        //binds
        this.associateTab = this.associateTab.bind(this)
        this.getPage = this.getPage.bind(this)
        this.getWebView = this.getWebView.bind(this)
        this.removePage = this.removePage.bind(this)
        this.getSearchInput = this.getSearchInput.bind(this)
        this.getSuggestions = this.getSuggestions.bind(this)
        this.resize = this.resize.bind(this)
        this.reloadExtensions = this.reloadExtensions.bind(this)
        //global properties
        this.tab = null
        this.extensions = null
        //state
        this.state = {
            render: true
        }
        checkFiles()
    }
    /*
    * lifecycle
    */
    componentDidUpdate() {
        this.tab.setPage(this)
    }
    componentDidMount() {
        var t = this,
            pageObj = {
                getPage: this.getPage,
                getWebView: this.getWebView,
                associateTab: this.associateTab,
                removePage: this.removePage,
                resize: this.resize,
                getExtensions: this.props.getExtensions
            },
            webview = this.refs.webview,
            bar = this.refs.bar
        this.props.addTab(pageObj)
        this.extensions = new Extensions
        this.resize()
        window.addEventListener('resize', function() {
            t.resize()
        })
        webview.addEventListener('page-title-updated', function(title) {
            t.tab.changeTitle(title.title)
            Storage.saveHistory(webview.getTitle(), webview.getURL())
        })
        webview.addEventListener('did-frame-finish-load', function() {
            $(bar.refs.searchInput).val(webview.getURL())
        })
        webview.addEventListener('page-favicon-updated', function(favicons) {
            t.tab.changeFavicon(favicons.favicons[0])
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
    * reloads only extensions that are related to current page
    */
    reloadExtensions() {

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
    * gets search input
    * returns ref of search input
    */
    getSearchInput() {
        return this.refs.bar.refs.searchInput
    }
    /*
    * gets suggestions
    * returns ref of suggestions
    */
    getSuggestions() {
        return this.refs.suggestions
    }
    /*
    * resizes WebView to match parent width and height
    */
    resize() {
        var barHeight = 42,
            tabsHeight = 32,
            height = barHeight + tabsHeight,
            width = 2
        if (this.refs.webview != null) {
            this.refs.webview.style.height = window.innerHeight - height + 'px'
            this.refs.webview.style.width = window.innerWidth - width + 'px'
        }
    }

    render() {
        var t = this,
            el = (
                <div className="page" ref="page">
                    <Bar ref="bar" getSuggestions={t.getSuggestions} getWebView={t.getWebView}></Bar>
                    <Suggestions ref="suggestions" getWebView={t.getWebView} getSearchInput={t.getSearchInput}></Suggestions>
                    <webview className="webview" ref="webview" src={this.props.url}></webview>
                </div>
            )
        if (this.state.render) {
            return el
        }
        return null
    }
}
