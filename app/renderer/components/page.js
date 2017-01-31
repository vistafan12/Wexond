'use babel';
import React from 'react';
import Bar from './bar.js';
import Suggestions from './suggestions.js';
import Storage from '../../classes/storage.js';
import Extensions from '../../classes/extensions.js';
import Colors from '../../classes/colors.js';
import MDMenu from './menu.js';

export default class Page extends React.Component {
    constructor() {
        super();
        //binds
        this.associateTab = this.associateTab.bind(this);
        this.getPage = this.getPage.bind(this);
        this.getWebView = this.getWebView.bind(this);
        this.removePage = this.removePage.bind(this);
        this.getSearchInput = this.getSearchInput.bind(this);
        this.getSuggestions = this.getSuggestions.bind(this);
        this.resize = this.resize.bind(this);
        this.reloadExtensions = this.reloadExtensions.bind(this);
        this.getExtensions = this.getExtensions.bind(this);
        this.onResize = this.onResize.bind(this);
        this.pageTitleUpdated = this.pageTitleUpdated.bind(this);
        this.frameFinishLoad = this.frameFinishLoad.bind(this);
        this.faviconUpdated = this.faviconUpdated.bind(this);
        this.updateColors = this.updateColors.bind(this);
        this.changeForeground = this.changeForeground.bind(this);
        this.getTitlebar = this.getTitlebar.bind(this);
        this.getTabbar = this.getTabbar.bind(this);
        this.prepareContextMenu = this.prepareContextMenu.bind(this);
        this.addContextMenuItem = this.addContextMenuItem.bind(this);
        this.ready = this.ready.bind(this);
        this.onContextMenu = this.onContextMenu.bind(this);
        this.focusSearchInput = this.focusSearchInput.bind(this);
        this.getMenu = this.getMenu.bind(this);
        this.openNewTab = this.openNewTab.bind(this);
        //global properties
        this.menu = new Menu();
        this.xToInspect = null;
        this.yToInspect = null;
        this.getTab = null;
        this.extensions = null;
        //state
        this.state = {
            render: true
        };
        checkFiles();
    }
    /*
    * lifecycle
    */
    componentDidMount() {
        this.prepareContextMenu();
        var pageObj = this.getPage,
            webview = this.refs.webview,
            bar = this.refs.bar,
            background = '#FAFAFA',
            t = this;

        this.select = this.props.select;

        this.props.getApp().addTab(pageObj);
        this.extensions = new Extensions();
        this.resize();

        window.addEventListener('resize', this.onResize);
        webview.addEventListener('page-title-updated', this.pageTitleUpdated);
        webview.addEventListener('dom-ready', this.ready);
        webview.addEventListener('did-frame-finish-load', this.frameFinishLoad);
        webview.addEventListener('page-favicon-updated', this.faviconUpdated);

        this.colors = new Colors(this.getWebView());
        this.colorInterval = setInterval(this.updateColors, 200);

        var lastLink = '';
        webview.addEventListener('ipc-message', function(e) {
            if (e.channel == 'scroll') {
                if (lastLink != e.args[0]) {
                    t.props.getApp().addPage({url: e.args[0], select: false});
                    lastLink = e.args[0];
                    setTimeout(function() {
                        lastLink = '';
                    }, 50);
                }
            }
            if (e.channel == 'LMB') {
                t.refs.menu.hide();
            }
        });

    }
    /*
    * open new tab with url
    */
    openNewTab(u, select) {
      this.props.getApp().addPage({url: u, select: select});
    }
    /*
    * appends and prepares context menu items
    */
    prepareContextMenu() {
        var webview = this.refs.webview,
            t = this;
        this.menu = new Menu();

        t.backMenuItem = new MenuItem({
            label: 'Back',
            click() {
                webview.goBack();
            }
        });
        t.forwardMenuItem = new MenuItem({
            label: 'Forward',
            click() {
                webview.goForward();
            }
        });
        t.refreshMenuItem = new MenuItem({
            label: 'Reload',
            click() {
                t.refs.bar.refresh();
            }
        });
        t.openLinkInNewTabMenuItem = new MenuItem({
            label: 'Open link in new tab',
            click() {
                if (t.linkToOpen != "") {
                    //add new tab
                    t.props.getApp().addPage({url: t.linkToOpen, select: false});
                }
            }
        });
        t.openImageInNewTabMenuItem = new MenuItem({
            label: 'Open image in new tab',
            click() {
                if (t.imageToSave != "") {
                    //add new tab
                    t.props.getApp().addPage({url: t.imageToSave, select: false});
                }
            }
        });
        t.copyLinkMenuItem = new MenuItem({
            label: 'Copy link address',
            click() {
                if (t.linkToOpen != "") {
                    clipboard.writeText(t.linkToOpen);
                }
            }
        });
        t.saveImageAsMenuItem = new MenuItem({label: 'Save image as', click() {
                //saves image as
            }});
        t.printMenuItem = new MenuItem({label: 'Print', click() {
                //prints webpage
            }});
        t.inspectElementMenuItem = new MenuItem({
            label: 'Inspect element',
            click() {
                webview.inspectElement(t.xToInspect, t.yToInspect);
            }
        });
        t.viewSourceMenuItem = new MenuItem({label: 'View source', click() {
                //views source
            }});
        t.separator1 = new MenuItem({type: 'separator'});
        t.separator2 = new MenuItem({type: 'separator'});
        t.addContextMenuItem(t.openLinkInNewTabMenuItem);
        t.addContextMenuItem(t.openImageInNewTabMenuItem);
        t.addContextMenuItem(t.backMenuItem);
        t.addContextMenuItem(t.forwardMenuItem);
        t.addContextMenuItem(t.refreshMenuItem);
        t.addContextMenuItem(t.separator1);
        t.addContextMenuItem(t.copyLinkMenuItem);
        t.addContextMenuItem(t.saveImageAsMenuItem);
        t.addContextMenuItem(t.printMenuItem);
        t.addContextMenuItem(t.separator2);
        t.addContextMenuItem(t.inspectElementMenuItem);
        t.addContextMenuItem(t.viewSourceMenuItem);
    }
    addContextMenuItem(item) {
        this.menu.append(item);
    }
    /*
    events
    */
    ready() {
        var webview = this.refs.webview,
            t = this;

        webview.getWebContents().removeListener('context-menu', this.onContextMenu);
        webview.getWebContents().on('context-menu', this.onContextMenu, false);
    }
    onContextMenu(e, params) {
        var webview = this.refs.webview,
            t = this;
        e.preventDefault();
        t.imageToSave = '';
        t.linkToOpen = '';
        if (params.mediaType == 'image') {
            t.imageToSave = params.srcURL;
        } else {
            t.imageToSave = '';
        }
        t.linkToOpen = params.linkURL;

        if (t.linkToOpen == "") {
            t.openLinkInNewTabMenuItem.visible = false;
            t.copyLinkMenuItem.visible = false;
        } else {
            t.openLinkInNewTabMenuItem.visible = true;
            t.copyLinkMenuItem.visible = true;
        }

        if (t.imageToSave == "") {
            t.saveImageAsMenuItem.visible = false;
            t.openImageInNewTabMenuItem.visible = false;
        } else {
            t.saveImageAsMenuItem.visible = true;
            t.openImageInNewTabMenuItem.visible = true;
        }

        if (t.imageToSave == "" && t.linkToOpen == "") {
            t.backMenuItem.visible = true;
            t.forwardMenuItem.visible = true;
            t.refreshMenuItem.visible = true;
            t.printMenuItem.visible = true;
        } else {
            t.backMenuItem.visible = false;
            t.forwardMenuItem.visible = false;
            t.refreshMenuItem.visible = false;
            t.printMenuItem.visible = false;
        }

        if (webview.canGoBack()) {
            t.backMenuItem.enabled = true;
        } else {
            t.backMenuItem.enabled = false;
        }
        if (webview.canGoForward()) {
            t.forwardMenuItem.enabled = true;
        } else {
            t.forwardMenuItem.enabled = false;
        }

        t.xToInspect = params.x;
        t.yToInspect = params.y;
        t.menu.popup(remote.getCurrentWindow());
    }
    pageTitleUpdated(title) {
        var webview = this.refs.webview;
        this.getTab().changeTitle(title.title);
        Storage.saveHistory(webview.getTitle(), webview.getURL());
    }
    frameFinishLoad() {
        var webview = this.refs.webview,
            bar = this.refs.bar;
        if (webview.getURL() != this.props.getApp().defaultURL)
            bar.refs.searchInput.value = webview.getURL();
        }
    faviconUpdated(favicons) {
        this.getTab().changeFavicon(favicons.favicons[0]);
    }
    onResize() {
        this.resize();
    }
    /*
    * gets colors from website
    */
    updateColors() {
        var t = this;
        if (this.getTab() != null || typeof this.getTab() !== 'undefined')
            if (this.getTab().isSelected() && !remote.getCurrentWindow().isMinimized()) {
                this.colors.getColor(function(data) {
                    if (t.getTab().isSelected()) {
                        if (t.refs.bar != null) {
                            t.refs.bar.refs.bar.css('background-color', data.background);
                        }
                        t.changeForeground(data.foreground, data.foreground == 'white'
                            ? '#fff'
                            : '#444');
                        t.getTab().setBackground(data.background);
                        t.getTab().setForeground(data.foreground, false);
                        t.getTitlebar().setBackground(shadeColor(data.background, -0.2));
                    }
                });
            }
        }
    /*
    * changes foreground of tab and bar
    * color - String color
    * ripple - String ripple color
    */
    changeForeground(color, ripple) {
        this.getTab().foreground = color;
        var barIcons = this.refs.bar.refs.bar.getElementsByClassName('bar-icon');
        if (color == 'white') {
            this.refs.bar.refs.searchBox.css({backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff', boxShadow: null});
            for (var i = 0; i < barIcons.length; i++) {
                var node = barIcons[i];
                if (node) {
                    node.addClass('white-icon');
                }
            }
            tabsHoverTransparency = 0.1;
            this.refs.bar.refs.searchInput.css({color: '#fff'});
        } else if (color == 'black' || color == 'semiblack') {
            this.refs.bar.refs.searchBox.css({backgroundColor: 'white', color: '#212121', boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)'});
            for (var i = 0; i < barIcons.length; i++) {
                var node = barIcons[i];
                if (node) {
                    node.removeClass('white-icon');
                }
            }
            this.refs.bar.refs.searchInput.css({color: '#212121'});
            tabsHoverTransparency = 0.4;
        }
        if (color == 'semiblack') {
            this.refs.bar.refs.searchBox.css({backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff', boxShadow: null});
            this.refs.bar.refs.searchInput.css({color: '#212121'});
        }

    }
    /*
    * disables page render
    */
    removePage() {
        var newState = this.state;
        newState.render = false;
        this.setState(newState);
        clearInterval(this.colorInterval);
    }
    /*
    * focuses search input
    */
    focusSearchInput() {
        if (this.refs.bar.refs.searchInput.value == '') {
            this.refs.bar.refs.searchInput.focus();
        }
    }
    /*
    * reloads only extensions that are related to current page
    */
    reloadExtensions() {
        this.extensions.deleteExtensions();
        this.extensions.loadExtensions(this.getTab().getIndex());
    }
    /*
    * gets extensions
    * returns object
    */
    getExtensions() {
        return this.extensions;
    }
    /*
    * gets page ref
    * returns page ref
    */
    getPage() {
        return this;
    }
    /*
    * gets WebView ref
    * returns WebView ref
    */
    getWebView() {
        return this.refs.webview;
    }
    /*
    * sets this.tab to new value
    * tab - tab object
    */
    associateTab(tab) {
        this.getTab = tab;
    }
    /*
    * gets search input
    * returns ref of search input
    */
    getSearchInput() {
        return this.refs.bar.refs.searchInput;
    }
    /*
    * gets suggestions
    * returns ref of suggestions
    */
    getSuggestions() {
        return this.refs.suggestions;
    }
    /*
    * resizes WebView to match parent width and height
    */
    resize() {
        var barHeight = 42,
            tabsHeight = 32,
            height = barHeight + tabsHeight,
            width = 0;
        if (this.refs.webview != null) {
            this.refs.webview.style.height = window.innerHeight - height + 'px';
            this.refs.webview.style.width = window.innerWidth - width + 'px';
        }
    }
    /*
    * returns Object tabbar
    */
    getTabbar() {
        return getTitlebar().refs.tabbar;
    }
    /*
    * returns Object titlebar
    */
    getTitlebar() {
        return this.props.getApp().refs.titlebar;
    }
    /*
    * returns Object menu
    */
    getMenu() {
        return this.refs.menu;
    }
    render() {
        var t = this,
            el = (
                <div className="page" ref="page">
                    <Bar ref="bar" getPage={t.getPage}></Bar>
                    <Suggestions ref="suggestions" getPage={t.getPage}></Suggestions>
                    <webview preload="../../classes/preload.js" className="webview" ref="webview" src={this.props.url}></webview>
                    <MDMenu ref="menu" getPage={t.getPage} addTab={(u, s) => this.openNewTab(u, s)}></MDMenu>
                </div>
            );
        if (this.state.render) {
            return el;
        }
        return null;
    }
}
