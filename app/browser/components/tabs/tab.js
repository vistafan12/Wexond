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
            backgroundColor: 'transparent',
            zIndex: 1,
            showLeftBorder: false,
            dragDisabled: false
        }
        this.getPage = null;
        this.backgroundColor = '#fff';
        this.xChange = 0;
        this.xStart = 0;
    }
    /*
    lifecycle
    */
    componentDidMount() {
        var self = this;

        tabs.push(this);

        if (tabs.indexOf(this) == 0) {
            this.setState({showLeftBorder: false});
        } else {
            this.setState({showLeftBorder: true});
        }

        this.props.getTabBar().setWidths();
        this.props.getTabBar().setPositions();

        this.props.getApp().addPage(self.getTab);
    }
    /*
    events
    */
    onDragStop = () => {
        this.props.getTabBar().setPositions();
        this.props.getTabBar().setState({addButtonVisibility: 'block'});
        this.xStart = 0;
        this.xChange = 0;
    }
    /*
    * @param1 {Object} e
    */
    onDrag = (e) => {
        this.xChange = e.x - this.xStart;
        console.log(this.xChange);
        if (this.xChange > 10) {
            this.setDraggablePosition(e.pageX);
        } else {
            e.preventDefault();
            this.setDraggablePosition(this.xStart);
        }
        this.props.getTabBar().setState({addButtonVisibility: 'none'});
        this.reorderTabs(e.pageX);
    }

    onDragStart = (e) => {
        //set others tabs z index to smaller
        for (var i = 0; i < tabs.length; i++) {
            if (tabs[i] != this) {
                tabs[i].setState({zIndex: 1});
            }
        }
        //set currently dragging tab's z index to greater than others
        this.setState({zIndex: 2});
        //this event works the same as onMouseDown event
        this.props.getTabBar().selectTab(this);
        this.xStart = e.pageX;
    }

    onPageInitialized = () => {
        if (this.props.data.select) {
            this.props.getTabBar().selectTab(this);
        }
    }
    /*
    * updates default position for draggable
    * @param1 {Number} mouseX
    */
    setDraggablePosition = (mouseX) => {
        var draggablePosition = this.getDraggablePosition(mouseX);
        this.setState({left: mouseX - draggablePosition});
    }
    /*
    * gets draggable position
    * @param1 {Number} mouseX
    * @return {Number}
    */
    getDraggablePosition = (mouseX) => {
        return mouseX - this.refs.tab.getBoundingClientRect().left;
    }
    /*
    * reorders tabs
    * @param1 {Number} cursorX
    */
    reorderTabs = (cursorX) => {
        var overTab = this.props.getTabBar().getTabFromMousePoint(this, cursorX);
        if (overTab != null) {
            var indexTab = tabs.indexOf(this);
            var indexOverTab = tabs.indexOf(overTab);
            this.props.getTabBar().replaceTabs(indexTab, indexOverTab, this, overTab);
        }
    }
    /*
    * gets tab
    * @return {Tab}
    */
    getTab = () => {
        return this;
    }

    render() {
        var tabStyle = {
            width: this.state.width,
            backgroundColor: this.state.backgroundColor,
            zIndex: this.state.zIndex
        }
        var draggableStyle = {
            x: this.state.left,
            y: 0
        }

        if (this.state.showLeftBorder) {
            tabStyle.borderLeft = '1px solid rgba(0,0,0,0.2)';
        } else {
            tabStyle.borderLeft = 'none';
        }

        return (
            <Draggable bounds="parent" axis="x" position={draggableStyle} onStop={this.onDragStop} onStart={this.onDragStart} onDrag={this.onDrag}>
                <div ref="tab" className="tab" style={tabStyle}>

                </div>
            </Draggable>
        );
    }
}
