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
    var self = this;
    this.props.getTab().getPage = this.getPage;
    this.props.getTab().onPageInitialized();
    this.resize();

    this.getWebView().addEventListener('ipc-message', function(e) {
      if (e.channel === 'webview:mouse-left-button') {
        var bar = self.props.getApp().getBar();
        bar.openedPanel = false;
        bar.hide();
        bar.hideSuggestions();
      }
    });

    this.getWebView().addEventListener('did-start-loading', function() {
      currentWindow.getChildWindows()[0].send('webview:can-go-back', self.getWebView().canGoBack());
      currentWindow.getChildWindows()[0].send('webview:can-go-forward', self.getWebView().canGoForward());
    });

    this.getWebView().addEventListener('did-finish-load', function() {
      if (self.props.getTab() != null && self.props.getTab().selected) {
        var bar = self.props.getApp().getBar();
        bar.setText(self.getWebView().getURL());
      }
    });

    this.getWebView().addEventListener('page-title-updated', function(e) {
      self.props.getTab().setState({title: e.title});
    });

    this.getWebView().addEventListener('page-favicon-updated', function(e) {
      self.props.getTab().setState({favicon: e.favicons[0]});
    });
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
