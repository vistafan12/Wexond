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
        this.prepareContextMenu = this.prepareContextMenu.bind(this)
        this.addContextMenuItem = this.addContextMenuItem.bind(this)
        this.ready = this.ready.bind(this)
        this.onContextMenu = this.onContextMenu.bind(this)
        //global properties
        this.menu = new Menu()
        this.xToInspect = null
        this.yToInspect = null
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
        this.prepareContextMenu()
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
        webview.addEventListener('dom-ready', this.ready)
        webview.addEventListener('did-frame-finish-load', this.frameFinishLoad)
        webview.addEventListener('page-favicon-updated', this.faviconUpdated)

        this.colors = new Colors(this.getWebView())
        this.colorInterval = setInterval(this.updateColors, 200)
    }
    /*
    * appends and prepares context menu items
    */
    prepareContextMenu() {
        var webview = this.refs.webview,
            t = this
        this.menu = new Menu()

        t.backMenuItem = new MenuItem({
            label: 'Back',
            click() {
                webview.goBack()
            }
        })
        t.forwardMenuItem = new MenuItem({
            label: 'Forward',
            click() {
                webview.goForward()
            }
        })
        t.refreshMenuItem = new MenuItem({
            label: 'Reload',
            click() {
                t.refs.bar.refresh()
            }
        })
        t.openLinkInNewTabMenuItem = new MenuItem({
            label: 'Open link in new tab',
            click() {
                if (t.linkToOpen != "") {
                    //add new tab
                    t.props.getApp().addPage({url: t.linkToOpen})
                }
            }
        })
        t.openImageInNewTabMenuItem = new MenuItem({
            label: 'Open image in new tab',
            click() {
                if (t.linkToOpen != "") {
                    //add new tab
                }
            }
        })
        t.copyLinkMenuItem = new MenuItem({
            label: 'Copy link address',
            click() {
                if (t.linkToOpen != "") {
                    clipboard.writeText(t.linkToOpen)
                }
            }
        })
        t.saveImageAsMenuItem = new MenuItem({label: 'Save image as', click() {
                //saves image as
            }})
        t.printMenuItem = new MenuItem({label: 'Print', click() {
                //prints webpage
            }})
        t.inspectElementMenuItem = new MenuItem({
            label: 'Inspect element',
            click() {
                webview.inspectElement(t.xToInspect, t.yToInspect)
            }
        })
        t.viewSourceMenuItem = new MenuItem({label: 'View source', click() {
                //views source
            }})
        t.separator1 = new MenuItem({type: 'separator'})
        t.separator2 = new MenuItem({type: 'separator'})
        t.addContextMenuItem(t.openLinkInNewTabMenuItem)
        t.addContextMenuItem(t.openImageInNewTabMenuItem)
        t.addContextMenuItem(t.backMenuItem)
        t.addContextMenuItem(t.forwardMenuItem)
        t.addContextMenuItem(t.refreshMenuItem)
        t.addContextMenuItem(t.separator1)
        t.addContextMenuItem(t.copyLinkMenuItem)
        t.addContextMenuItem(t.saveImageAsMenuItem)
        t.addContextMenuItem(t.printMenuItem)
        t.addContextMenuItem(t.separator2)
        t.addContextMenuItem(t.inspectElementMenuItem)
        t.addContextMenuItem(t.viewSourceMenuItem)
    }
    addContextMenuItem(item) {
        this.menu.append(item)
    }
    /*
    events
    */
    ready() {
        var webview = this.refs.webview,
            t = this

        webview.getWebContents().removeListener('context-menu', this.onContextMenu)
        webview.getWebContents().on('context-menu', this.onContextMenu, false)

    }
    onContextMenu(e, params) {
        var webview = this.refs.webview,
            t = this
        e.preventDefault()
        t.imageToSave = ''
        t.linkToOpen = ''
        if (params.mediaType == 'image') {
            t.imageToSave = params.srcURL
        } else {
            t.imageToSave = ''
        }
        t.linkToOpen = params.linkURL

        if (t.linkToOpen == "") {
            t.openLinkInNewTabMenuItem.visible = false
            t.copyLinkMenuItem.visible = false
        } else {
            t.openLinkInNewTabMenuItem.visible = true
            t.copyLinkMenuItem.visible = true
        }

        if (t.imageToSave == "") {
            t.saveImageAsMenuItem.visible = false
            t.openImageInNewTabMenuItem.visible = false
        } else {
            t.saveImageAsMenuItem.visible = true
            t.openImageInNewTabMenuItem.visible = true
        }

        if (t.imageToSave == "" && t.linkToOpen == "") {
            t.backMenuItem.visible = true
            t.forwardMenuItem.visible = true
            t.refreshMenuItem.visible = true
            t.printMenuItem.visible = true
        } else {
            t.backMenuItem.visible = false
            t.forwardMenuItem.visible = false
            t.refreshMenuItem.visible = false
            t.printMenuItem.visible = false
        }

        if (webview.canGoBack()) {
            t.backMenuItem.enabled = true
        } else {
            t.backMenuItem.enabled = false
        }
        if (webview.canGoForward()) {
            t.forwardMenuItem.enabled = true
        } else {
            t.forwardMenuItem.enabled = false
        }

        t.xToInspect = params.x
        t.yToInspect = params.y
        t.menu.popup(remote.getCurrentWindow())
    }
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
                        t.changeForeground(data.foreground, data.foreground == 'white'
                            ? '#fff'
                            : '#444')
                        t.tab.setBackground(data.background)
                        t.tab.setForeground(data.foreground, false)
                        t.getTitlebar().setBackground(shadeColor(data.background, -0.2))
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
            $(this.refs.bar.refs.searchBox).css({backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff', boxShadow: null})
            $(this.refs.bar.refs.bar).css({color: '#fff'})
            $(this.refs.bar.refs.searchInput).css({color: '#fff'})
            this.refs.bar.setHoverColor('rgba(255, 255, 255, 0.2)')
        } else if (color == 'black') {
            $(this.refs.bar.refs.searchBox).css({backgroundColor: 'white', color: '#212121', boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)'})
            $(this.refs.bar.refs.bar).css({color: '#212121'})
            $(this.refs.bar.refs.searchInput).css({color: '#212121'})
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
        clearInterval(this.colorInterval)
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
