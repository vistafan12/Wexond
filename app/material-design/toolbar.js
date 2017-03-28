import React from 'react'

import '../resources/material-design/scss/toolbar.scss'

export default class Toolbar extends React.Component {
  render () {
    var toolbarStyle = {
      backgroundColor: this.props.backgroundColor,
      color: this.props.color,
      height: this.props.height
    }

    toolbarStyle = Object.assign(toolbarStyle, this.props.style)

    return (
      <div style={toolbarStyle} className={'toolbar ' + this.props.className}>
        {this.props.children}
      </div>
    )
  }
}

Toolbar.defaultProps = {
  backgroundColor: '#03A9F4',
  color: '#fff',
  height: 52
}
