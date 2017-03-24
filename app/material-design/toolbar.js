import React from 'react';

import '../resources/material-design/scss/toolbar.scss';

export default class Toolbar extends React.Component {
    constructor() {
        super();
    }

    render() {
        var toolbarStyle = {
            backgroundColor: this.props.backgroundColor,
            color: this.props.color
        };

        return (
            <div style={Object.assign(toolbarStyle, this.props.style)} className={"toolbar " + this.props.className}>
                {this.props.children}
            </div>
        );
    }
}

Toolbar.defaultProps = {
    backgroundColor: '#03A9F4',
    color: '#000'
};
