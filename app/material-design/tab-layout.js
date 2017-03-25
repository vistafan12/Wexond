import React from 'react';
import {Motion, spring} from 'react-motion';

import '../resources/material-design/scss/tab-layout.scss';

export default class TabLayout extends React.Component {
    constructor() {
        super();

        this.state = {
            tabs: [],
            width: 0,
            dividerLeft: 0,
            dividerWidth: 0,
        }

        this.tabs = [];
    }

    componentDidMount() {
        this.setState({width: this.refs.tabLayout.offsetWidth});
    }
    /*
    * gets tab layout
    * @return {TabLayout}
    */
    getTabLayout = () => {
        return this;
    }

    render() {
        var tabStyle = {
            width: this.state.width / this.state.tabs.length
        };
        var dividerStyle = {
            width: this.state.dividerWidth,
            backgroundColor: this.props.color
        }

        return (
            <div ref="tabLayout" className="tab-layout">
                {this.state.tabs.map((object, i) => {
                    return <Tab getTabLayout={this.getTabLayout} key={i} style={tabStyle} data={object}></Tab>
                })}
                <Motion style={{left: this.state.dividerLeft, width: this.state.dividerWidth}}>
                    {value =>
                        <div className="divider" style={{backgroundColor: this.props.color, width: value.width, left: value.left}}>

                        </div>
                    }
                </Motion>
                {this.props.children}

            </div>
        )
    }
}

class Tab extends React.Component {
    constructor() {
        super();

        this.state = {
            color: '#000'
        }
    }

    componentDidMount() {
        this.props.getTabLayout().tabs.push(this);
    }
    /*
    events
    */
    onClick = () => {
        for (var i = 0; i < this.props.getTabLayout().tabs.length; i++) {
            this.props.getTabLayout().tabs[i].deselect();
        }
        this.select();
    }
    /*
    * deselects tab
    */
    deselect = () => {
        this.setState({color: '#000'});

    }
    /*
    * selects tab
    */
    select = () => {
        this.setState({color: this.props.getTabLayout().props.color});
        this.props.getTabLayout().setState(
            {
                dividerWidth: spring(this.refs.tab.offsetWidth, menuAnimationData.tabsDividerSpring),
                dividerLeft: spring(this.refs.tab.offsetLeft, menuAnimationData.tabsDividerSpring)
            }
        );
    }

    render() {
        var tabTitleStyle = {
            color: this.state.color
        };

        return (
            <div ref="tab" onClick={this.onClick} style={this.props.style} className="tab">
                <div style={tabTitleStyle} className="tab-title">
                    {this.props.data.title}
                </div>
            </div>
        )
    }
}

TabLayout.defaultProps = {
    color: '#03A9F4'
}
