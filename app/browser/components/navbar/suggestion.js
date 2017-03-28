import React from 'react'

import '../../../resources/browser/scss/suggestion.scss'

export default class Suggestion extends React.Component {
  constructor () {
    super()

    this.state = {
      text: '',
      url: '',
      title: ''
    }
  }

  componentDidMount () {
    if (this.props.data.type === 'history') {
      this.setState({url: this.props.data.url, title: this.props.data.title})
    } else {
      this.setState({text: this.props.data.text})
    }
  }

  render () {
    var content = (this.props.data.type === 'history')
      ? (
        <div>
          <div className='suggestion-url'>{this.state.url}</div>
          <div className='suggestion-title'>{' — ' + this.state.title}</div>
        </div>
      )
      : this.state.text

    return (
      <div className='suggestion'>
        {content}
      </div>
    )
  }
}
