import React from 'react';
import {Motion, spring} from 'react-motion';
import ReactDOM from 'react-dom';

import '../resources/material-design/scss/tab-layout.scss';

export default class TabLayout extends React.Component {
  constructor() {
    super();

    this.state = {
      tabs: [],
      width: 0,
      dividerLeft: 0,
      dividerWidth: 0
    }

    this.tabs = [];
  }

  componentDidMount() {
    this.setState({width: this.refs.tabLayout.offsetWidth});

    if (this.props.onSelect != null) {
      ReactDOM.findDOMNode(this).addEventListener('selected', this.props.onSelect);
    }
  }
  /*
    * selects and deselects tabs
    */
  selectTab = (tab) => {
    for (var i = 0; i < this.tabs.length; i++) {
      if (this.tabs[i] != tab) {
        this.tabs[i].deselect();
      }
    }
    tab.select();
    var event = document.createEvent('Event');
    event.initEvent('selected', true, true);
    event.page = tab.props.data.page;
    ReactDOM.findDOMNode(this).dispatchEvent(event);
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
        <Motion style={{
          left: this.state.dividerLeft,
          width: this.state.dividerWidth
        }}>
          {value => <div className="divider" style={{
            backgroundColor: this.props.color,
            width: value.width,
            left: value.left
          }}></div>
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
      color: '#fff'
    }
  }

  componentDidMount() {
    this.setState({color: this.props.defaultColor});
    this.props.getTabLayout().tabs.push(this);
  }
  /*
    events
    */
  onClick = () => {
    this.props.getTabLayout().selectTab(this);
  }
  /*
    * deselects tab
    */
  deselect = () => {
    this.setState({color: this.props.defaultColor});
    if (this.props.data.page != null) {
      this.props.data.page.style.display = 'none';
    }
  }
  /*
    * selects tab
    */
  select = () => {
    this.setState({color: this.props.getTabLayout().props.color});
    this.props.getTabLayout().setState({
      dividerWidth: spring(this.refs.tab.offsetWidth, menuAnimationData.tabsDividerSpring),
      dividerLeft: spring(this.refs.tab.offsetLeft, menuAnimationData.tabsDividerSpring)
    });
    if (this.props.data.page != null) {
      this.props.data.page.style.display = 'block';
    }
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
  color: '#fff',
  defaultColor: 'rgba(255, 255, 255, 0.7)'
}
