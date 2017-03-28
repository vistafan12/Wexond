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

    checkFiles();
  }
  /*
    * lifecycle
    */
  componentDidMount() {
    this.props.getTab().getPage = this.getPage;
    this.props.getTab().onPageInitialized();
    this.resize();

    // webview events

    this.getWebView().addEventListener('ipc-message', this.onIpcMessageWebView);
    this.getWebView().addEventListener('did-start-loading', this.onDidStartLoadingWebView);
    this.getWebView().addEventListener('did-finish-load', this.onDidFinishLoadWebView);
    this.getWebView().addEventListener('page-title-updated', this.onPageTitleUpdatedWebView);
    this.getWebView().addEventListener('page-favicon-updated', this.onPageFaviconUpdatedWebView);
  }

  /*
  events
  */
  onPageFaviconUpdatedWebView = (e) => {
    self.props.getTab().setState({favicon: e.favicons[0]});
  }

  onPageTitleUpdatedWebView = (e) => {
    this.props.getTab().setState({title: e.title});
  }

  onDidFinishLoadWebView = () => {
    if (this.props.getTab() != null && this.props.getTab().selected) {
      var bar = this.props.getApp().getBar();
      bar.setText(this.getWebView().getURL());
    }
  }

  onDidStartLoadingWebView = () => {
    var browserMenu = currentWindow.getChildWindows()[0];
    browserMenu.send('webview:can-go-back', this.getWebView().canGoBack());
    browserMenu.send('webview:can-go-forward', this.getWebView().canGoForward());
  }

  onIpcMessageWebView = (e) => {
    if (e.channel === 'webview:mouse-left-button') {
      var bar = this.props.getApp().getBar();
      bar.openedPanel = false;
      bar.hide();
      bar.hideSuggestions();
    }
  }

  /*
    * resizes contents of page
    */
  resize = () => {
    this.setState({
      webviewHeight: window.innerHeight - 32
    });
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
          <webview preload="../webview-preload/global.js" className="page-webview" style={webviewStyle} src={this.props.getTab().props.data.url} ref="webview"></webview>
        </div>
      );
    }
    return null;
  }
}
