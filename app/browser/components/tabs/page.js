import React from 'react';
import ReactDOM from 'react-dom';

import '../../../resources/browser/scss/page.scss';

export default class Page extends React.Component {
    constructor() {
        super();

        //global properties
        this.state = {
            render: true,
            visible: false,
            webviewHeight: 0
        };
        this.getTab = null;
        checkFiles();
    }
    /*
    * lifecycle
    */
    componentDidMount() {
        var self = this;
        this.props.getTab().getPage = this.getPage;
        this.props.getTab().onPageInitialized();
        this.resize();

        this.getWebView().addEventListener('ipc-message', function(e) {
            if (e.channel === 'webview:mouse-left-button') {
                //self.props.getApp().getBrowserMenu().hide();
            }
        });
    }
    /*
    * resizes contents of page
    */
    resize = () => {
        this.setState({webviewHeight: window.innerHeight - 32});
    }
    /*
    * gets page
    * @return {Page}
    */
    getPage = () => {
        return this;
    }
    /*
    * gets webview
    * @return {<webview>}
    */
    getWebView = () => {
        return this.refs.webview;
    }

    render() {
        var self = this;

        var pageStyle = {};

        var webviewStyle = {
            height: this.state.webviewHeight
        };

        if (this.state.visible) {
            pageStyle.opacity = 1;
            pageStyle.position = 'relative';
            pageStyle.height = '100vh';
        } else {
            pageStyle.opacity = 0;
            pageStyle.position = 'absolute';
            pageStyle.height = 0;
        }

        if (this.state.render) {
            return (
                <div className="page" style={pageStyle}>
                    <webview preload="../webview-preload/global.js" className="page-webview" style={webviewStyle} src="http://google.pl" ref="webview"></webview>
                </div>
            );
        }
        return null;
    }
}
