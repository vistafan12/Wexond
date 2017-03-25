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

class ToolbarItem extends React.Component {
    constructor() {
        super();
    }
    render() {
        var position;
        if (this.props.position === 'left') {
            position = 'toolbar-left';
        }
        if (this.props.position === 'center') {
            position = 'toolbar-center';
        }
        if (this.props.position === 'right') {
            position = 'toolbar-right';
        }

        var isInverted = ((this.props.inverted == false) ? '' : 'inverted ');
        var className = "toolbar-item " + isInverted + position + " " + this.props.className;

        var style = {
            color: this.props.color,
            opacity: this.props.opacity
        };

        style = Object.assign(style, this.props.style);

        return (
            <div className={className} style={style}>
                {this.props.children}
            </div>
        );
    }
}

export {Toolbar, ToolbarItem};

Toolbar.defaultProps = {
    backgroundColor: '#03A9F4',
    color: '#000'
};

ToolbarItem.defaultProps = {
    position: 'left',
    color: '#000',
    opacity: 0.9,
    inverted: false
};
