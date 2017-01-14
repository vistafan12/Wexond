'use babel';
import React from 'react';
import Bar from '../bar.jsx'
import Suggestions from '../suggestions.jsx'
import Storage from '../../classes/storage.js'
import Extensions from '../../classes/extensions.js'
import Colors from '../../classes/colors.js'

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
        this.getExtensions = this.getExtensions.bind(this)
        this.onResize = this.onResize.bind(this)
        this.pageTitleUpdated = this.pageTitleUpdated.bind(this)
        this.frameFinishLoad = this.frameFinishLoad.bind(this)
        this.faviconUpdated = this.faviconUpdated.bind(this)
        this.updateColors = this.updateColors.bind(this)
        this.changeForeground = this.changeForeground.bind(this)
        this.getTitlebar = this.getTitlebar.bind(this)
        this.getTabbar = this.getTabbar.bind(this)
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
        var pageObj = {
                getPage: this.getPage,
                getWebView: this.getWebView,
                associateTab: this.associateTab,
                removePage: this.removePage,
                resize: this.resize,
                getExtensions: this.getExtensions
            },
            webview = this.refs.webview,
            bar = this.refs.bar,
            background = '#FAFAFA'

        this.props.addTab(pageObj)
        this.extensions = new Extensions()
        this.resize()

        window.addEventListener('resize', this.onResize)
        webview.addEventListener('page-title-updated', this.pageTitleUpdated)
        webview.addEventListener('did-frame-finish-load', this.frameFinishLoad)
        webview.addEventListener('page-favicon-updated', this.faviconUpdated)

        this.colors = new Colors(this.getWebView())
        setInterval(this.updateColors, 200)
    }

    /*
    events
    */
    pageTitleUpdated(title) {
        var webview = this.refs.webview
        this.tab.changeTitle(title.title)
        Storage.saveHistory(webview.getTitle(), webview.getURL())
    }
    frameFinishLoad() {
        var webview = this.refs.webview,
        bar = this.refs.bar
        $(bar.refs.searchInput).val(webview.getURL())
    }
    faviconUpdated(favicons) {
        this.tab.changeFavicon(favicons.favicons[0])
    }
    onResize() {
        this.resize()
    }
    /*
    * gets colors from website
    */
    updateColors() {
        var t = this
        if (this.tab != null || typeof this.tab !== 'undefined')
            if (this.tab.isSelected() && !remote.getCurrentWindow().isMinimized()) {
                this.colors.getColor(function(data) {
                    if (t.tab.isSelected()) {
                        $(t.refs.bar.refs.bar).css('background-color', data.background)
                        t.changeForeground(data.foreground, data.foreground == 'white' ? '#fff' : '#444')
                        t.tab.setBackground(data.background)
                        t.tab.setForeground(data.foreground, false)
                        t.getTitlebar().setBackground(shadeColor(data.background, -30))
                    }
                })
            }
    }
    /*
    * changes foreground of tab and bar
    * color - String color
    * ripple - String ripple color
    */
    changeForeground(color, ripple) {
        this.tab.foreground = color
        if (color == 'white') {
            $(this.refs.bar.refs.searchBox).css({
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: '#fff',
                boxShadow: null
            })
            $(this.refs.bar.refs.bar).css({
                color: '#fff'
            })
            $(this.refs.bar.refs.searchInput).css({
                color: '#fff'
            })
            this.refs.bar.setHoverColor('rgba(255, 255, 255, 0.2)')
        } else if (color == 'black') {
            $(this.refs.bar.refs.searchBox).css({
                backgroundColor: 'white',
                color: '#212121',
                boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)'
            })
            $(this.refs.bar.refs.bar).css({
                color: '#212121'
            })
            $(this.refs.bar.refs.searchInput).css({
                color: '#212121'
            })
            this.refs.bar.setHoverColor('rgba(0, 0, 0, 0.2)')
        }
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
        this.extensions.deleteExtensions();
        this.extensions.loadExtensions(this.tab.getIndex())
    }
    /*
    * gets extensions
    * returns object
    */
    getExtensions() {
        return this.extensions
    }
    /*
    * gets page ref
    * returns page ref
    */
    getPage() {
        return this
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
            width = 0
        if (this.refs.webview != null) {
            this.refs.webview.style.height = window.innerHeight - height + 'px'
            this.refs.webview.style.width = window.innerWidth - width + 'px'
        }
    }
    /*
    * returns Object tabbar
    */
    getTabbar() {
        return getTitlebar().refs.tabbar
    }
    /*
    * returns Object titlebar
    */
    getTitlebar() {
        return this.props.getApp().refs.titlebar
    }

    render() {
        var t = this,
            el = (
                <div className="page" ref="page">
                    <Bar reloadExtensions={t.reloadExtensions} ref="bar" getSuggestions={t.getSuggestions} getWebView={t.getWebView}></Bar>
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
