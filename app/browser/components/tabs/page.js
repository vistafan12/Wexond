'use babel';
import React from 'react';
import ReactDOM from 'react-dom';

import '../../../resources/browser/scss/page.scss';

export default class Page extends React.Component {
    constructor() {
        super();

        //global properties
        this.state = {
            render: true,
            visible: false
        };
        this.getTab = null;
        checkFiles();
    }
    /*
    * lifecycle
    */
    componentDidMount() {
        this.props.getTab().getPage = this.getPage;
        this.props.getTab().onPageInitialized();
    }
    /*
    * gets page
    * @return {Page}
    */
    getPage = () => {
        return this;
    }

    render() {
        var self = this;

        var pageStyle = {};

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

                </div>
            );
        }
        return null;
    }
}
