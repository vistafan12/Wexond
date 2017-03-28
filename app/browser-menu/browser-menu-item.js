import React from 'react'

import '../resources/browser-menu/scss/menu-item.scss'

export default class BrowserMenuItem extends React.Component {
  constructor () {
    super()
  }

  render () {
    var img = this.props.icon;
    return (
      <div className="menu-item">
        <div className="menu-item-icon" style={{backgroundImage: `url(${img})`}} />
        <div className="menu-item-title">
          {this.props.children}
        </div>
      </div>
    )
  }
}
