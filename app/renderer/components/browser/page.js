'use babel';
import React from 'react';
import Bar from './bar.js';
import Suggestions from './suggestions.js';
import Storage from '../../../classes/storage.js';
import Extensions from '../../../classes/extensions.js';
import Colors from '../../../classes/colors.js';
import MDMenu from './menu.js';
import Snackbar from '../materialdesign/snackbar.js';

export default class Page extends React.Component {
    constructor() {
        super();
        //global properties
        this.menu = new Menu();
        this.posToInspect = [];
        this.getTab = null;
        this.extensions = null;
        this.menuItems = [];
        this.imageToSave = '';
        this.linkToOpen = '';

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
            webview = this.getWebView(),
            bar = this.getBar(),
            t = this;

        this.select = this.props.select;

        this.props.getApp().addTab(pageObj);
        this.extensions = new Extensions();

        this.resize();
        window.addEventListener('resize', this.onResize);

        //webview events
        webview.addEventListener('page-title-updated', this.pageTitleUpdated);
        webview.addEventListener('dom-ready', this.ready);
        webview.addEventListener('did-frame-finish-load', this.frameFinishLoad);
        webview.addEventListener('page-favicon-updated', this.faviconUpdated);
        webview.addEventListener('new-window', this.newWindow);

        //colors
        this.colors = new Colors(this.getWebView());
        this.colorInterval = setInterval(this.updateColors, 200);

        //mouse events
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
                t.getMenu().hide();
                t.getSuggestions().hide();
            }

        });

        //when adding new tab don't hide bar
        this.getBar().locked = true;
        this.getBar().show();
    }
    /*
    events
    */
    onReady = () => {
        var webview = this.getWebView();

        webview.getWebContents().removeListener('context-menu', this.onContextMenu);
        webview.getWebContents().on('context-menu', this.onContextMenu, false);
        webview.getWebContents().send('env', process.env.ENV);
    }
    onPageTitleUpdate = (title) => {
        var webview = this.getWebView();
        this.getTab().changeTitle(title.title);
        this.title = title.title;
    }
    onFrameFinishLoad = (e) => {
        var webview = this.getWebView(),
            bar = this.getBar();
        if (webview.getURL() != this.props.getApp().defaultURL) {
            bar.getSearchInput().value = webview.getURL();
            bar.locked = false;
        } else {
            bar.locked = true;
            bar.show();
        }
        if (e.isMainFrame && !webview.getURL().startsWith("wexond://history") && !webview.getURL().startsWith("wexond://newtab")) {
            Storage.saveHistory(webview.getTitle(), webview.getURL());
        }

        this.getBar().getFavouriteIcon().style.display = 'block';
        this.getTab().changeTitle(title.title);
    }
    onNewWindow = (e) => {
        this.props.getApp().addPage({url: e.url, select: true});
    }
    onFaviconUpdated = (favicons) => {
        this.getTab().changeFavicon(favicons.favicons[0]);
    }
    onResize = () => {
        this.resize();
    }
    onContextMenu = (e, params) => {

        /*
        * Menu items:
        * 0: back
        * 1: forward
        * 2: refresh
        * 3: open link in new tab
        * 4: open image in new tab
        * 5: copy link
        * 6: save image as
        * 7: print
        * 8: inspect element
        * 9: view source
        * 10: separator 1
        * 11: separator 2
        */

        var webview = this.getWebView(),
            t = this;
        e.preventDefault();
        t.imageToSave = '';
        t.linkToOpen = '';

        if (params.mediaType == 'image') {
            t.imageToSave = params.srcURL;
        } else {
            t.imageToSave = '';
        }
        console.log(params);
        t.linkToOpen = params.linkURL;

        t.posToInspect = [params.x, params.y];
        t.menu.popup(remote.getCurrentWindow());
    }
    /*
    * appends and prepares context menu items
    */
    prepareContextMenu = () => {
        var webview = this.getWebView(),
            t = this;
        this.menu = new Menu();

        //back menu item id: 0
        this.menuItems.push(new MenuItem({
            label: 'Back',
            click() {
                webview.goBack();
            }
        }));
        //forward menu item id: 1
        this.menuItems.push(new MenuItem({
            label: 'Forward',
            click() {
                webview.goForward();
            }
        }));
        //refresh menu item id: 2
        this.menuItems.push(new MenuItem({
            label: 'Reload',
            click() {
                t.getBar().refresh();
            }
        }));
        //open link in new tab menu item id: 3
        this.menuItems.push(new MenuItem({
            label: 'Open link in new tab',
            click() {
                if (t.linkToOpen != "") {
                    //add new tab
                    t.props.getApp().addPage({url: t.linkToOpen, select: false});
                }
            }
        }));
        //open image in new tab menu item id: 4
        this.menuItems.push(new MenuItem({
            label: 'Open image in new tab',
            click() {
                if (t.imageToSave != "") {
                    //add new tab
                    t.props.getApp().addPage({url: t.imageToSave, select: false});
                }
            }
        }));
        //copy link menu item id: 5
        this.menuItems.push(new MenuItem({
            label: 'Copy link address',
            click() {
                if (t.linkToOpen != "") {
                    clipboard.writeText(t.linkToOpen);
                }
            }
        }));
        //save image as menu item id: 6
        this.menuItems.push(new MenuItem({label: 'Save image as', click() {
                //saves image as
            }}));
        //print menu item id: 7
        this.menuItems.push(new MenuItem({label: 'Print', click() {
                //prints webpage
            }}));
        //inspect element menu item id: 8
        this.menuItems.push(new MenuItem({
            label: 'Inspect element',
            click() {
                webview.inspectElement(t.xToInspect, t.yToInspect);
            }
        }));
        //view source menu item id: 9
        this.menuItems.push(new MenuItem({label: 'View source', click() {
                //views source
            }}));
        //separator 1 id: 10
        this.menuItems.push(new MenuItem({type: 'separator'}));
        //separator 1 id: 11
        this.menuItems.push(new MenuItem({type: 'separator'}));

        for (var i = 0; i < this.menuItems.length; i++) {
            this.menu.append(this.menuItems[i]);
        }
    }
    /*
    * open new tab with url
    */
    addTab = (u, select) => {
        this.props.getApp().addPage({url: u, select: select});
    }
    /*
    * gets colors from website
    */
    updateColors = () => {
        var t = this;
        if (this.getTab() != null || typeof this.getTab() !== 'undefined') {
            if (remote != null) {
                if (this.getTab().isSelected() && !remote.getCurrentWindow().isMinimized()) {
                    this.colors.getColor(function(data) {
                        if (remote != null) {
                            if (t.getTab().isSelected() && !remote.getCurrentWindow().isMinimized()) {}
                        }
                    });
                }
            }
        }
    }
    /*
    * changes foreground of tab and bar
    * color - String color
    * ripple - String ripple color
    */
    changeForeground = (color, ripple) => {}
    /*
    * disables page render
    */
    removePage = () => {
        var newState = this.state;
        newState.render = false;
        this.setState(newState);
        clearInterval(this.colorInterval);
    }
    /*
    * focuses search input
    */
    focusSearchInput = () => {
        if (this.getBar().getSearchInput().value == '') {
            this.getBar().getSearchInput().focus();
        }
    }
    /*
    * reloads only extensions that are related to current page
    */
    loadExtensions = () => {
        var t = this;
        this.extensions.deleteExtensions();
        this.getMenu().removeExtensions();
        this.extensions.loadExtensions(this.getTab().getIndex(), function(data) {
            t.extensions.addExtensionToMenu(data, t.getMenu());
        });
    }
    /*
    * resizes WebView to match parent width and height
    */
    resize = () => {
        var barHeight = 0,
            tabsHeight = 32,
            height = tabsHeight,
            width = 0;
        if (this.getWebView() != null) {
            this.getWebView().style.height = window.innerHeight - height + 'px';
            this.getWebView().style.width = window.innerWidth - width + 'px';
        }
    }
    /*
    * sets snackbar text
    */
    setSnackbarText = (text) => {
        this.setState({snackbartext: text});
    }
    /*
    * returns this
    */
    getPage = () => {
        return this;
    }
    /*
    * returns webview
    */
    getWebView = () => {
        return this.refs.webview;
    }
    /*
    * returns menu
    */
    getMenu = () => {
        return this.refs.menu;
    }
    /*
    * returns bar
    */
    getBar = () => {
        return this.refs.bar;
    }
    /*
    * returns suggestionsWindow
    */
    getSuggestions = () => {
        return this.refs.suggestions;
    }

    render() {
        var t = this;

        if (this.state.render) {
            return (
                <div className="page" ref="page">
                    <Bar ref="bar" getPage={t.getPage}></Bar>
                    <Suggestions ref="suggestions" getPage={t.getPage}></Suggestions>
                    <webview preload="../../classes/preload.js" className="webview" ref="webview" src={this.props.url}></webview>
                    <MDMenu ref="menu" getPage={t.getPage} addTab={(u, s) => this.openNewTab(u, s)}></MDMenu>
                </div>
            );
        } else {
            return null;
        }
    }
}
