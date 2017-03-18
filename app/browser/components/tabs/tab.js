import React from 'react';
import ReactDOM from 'react-dom';

import Draggable from 'react-draggable';

import '../../../resources/browser/scss/tab.scss';

export default class Tab extends React.Component {
    constructor() {
        super();
        //global properties
        this.state = {
            left: 0,
            width: 0,
            backgroundColor: 'transparent'
        }
        this.backgroundColor = '#fff';
    }
    /*
    lifecycle
    */
    componentDidMount() {
        tabs.push(this);

        this.props.getTabBar().setWidths();
        this.props.getTabBar().setPositions();

        if (this.props.data.select) {
            this.props.getTabBar().selectTab(this);
        }
    }

    onClick = (e) => {
        this.props.getTabBar().selectTab(this);
    }

    onDragStop = (e) => {
        console.log(e);
        this.setState({left: e.x});
    }

    render() {
        var tabStyle = {
            width: this.state.width,
            backgroundColor: this.state.backgroundColor
        }
        var draggableStyle = {
            x: this.state.left,
            y: 0
        }
        return (
            <Draggable onStop={this.onDragStop} axis="x" position={draggableStyle}>
                <div className="tab" style={tabStyle} onClick={this.onClick}>

                </div>
            </Draggable>
        );
    }
}
