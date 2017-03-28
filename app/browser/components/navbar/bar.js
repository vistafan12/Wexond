import React from 'react'
import {Motion, spring} from 'react-motion'
import Suggestion from './suggestion'
import Network from '../../../helpers/network'

import '../../../resources/browser/scss/bar.scss'
import '../../../resources/browser/scss/suggestions.scss'

export default class Bar extends React.Component {
  constructor () {
    super()

    this.state = {
      barTop: -20,
      barOpacity: 0,
      suggestionsOpacity: 0,
      isHintVisible: true,
      suggestionsToCreate: [],
      isBarVisible: false,
      isSuggestionsVisible: false
    }

    this.openedPanel = false
    this.locked = false

    this.canSuggest = false
    this.suggestions = []

    this.input = null
    this.lastText = ''

    this.shown = false
    this.isBarVisible = false
    this.isSuggestionsVisible = false
  }

  componentDidMount () {
    document.body.addEventListener('mousemove', this.onMouseMove)
  }

  /*
  events
  */
  onChange = (e) => {
    var self = this

    this.updateBar(true)

    var suggestions = []

    this.getHistorySuggestions(this.input, function (data, error) {
      if (!error) {
        for (var i = 0; i < data.length; i++) {
          var object = {
            type: 'history',
            url: data[i].url,
            title: data[i].title
          }
          suggestions.push(object)
        }
      }

      self.getSearchSuggestions(self.input, function (data, error) {
        if (!error) {
          for (var i = 0; i < data.length; i++) {
            var object = {
              type: 'search',
              text: data[i]
            }
            suggestions.push(object)
          }
        }

        self.setState({suggestionsToCreate: []})
        self.setState({suggestionsToCreate: suggestions})
      })
    })
  }

  onSuggestionsClick = () => {
    this.hideSuggestions()
  }

  onKeyDown = (e) => {
    var key = e.keyCode || e.charCode
    // blacklist: backspace, enter, ctrl, alt, shift, tab, caps lock, delete, space
    if (key !== 8 && key !== 13 && key !== 17 && key !== 18 && key !== 16 && key !== 9 && key !== 20 && key !== 46 && key !== 32) {
      this.canSuggest = true
    }
    // arrow key up
    if (e.keyCode === 38) {
      e.preventDefault()
    }
    // arrow key down
    if (e.keyCode === 40) {
      e.preventDefault()
    }
    e.currentTarget.focus()
  }

  onRest = () => {
    if (!this.isBarVisible) {
      this.setState({isSuggestionsVisible: false, isBarVisible: false})
    }
    if (!this.isSuggestionsVisible) {
      this.setState({isSuggestionsVisible: false})
    }
  }

  onFocus = () => {
    this.input.setSelectionRange(0, this.input.value.length)
  }

  onMouseMove = (e) => {
    if (e.pageY > 120 && !this.locked && !this.openedPanel && this.shown) {
      this.hide()
    }
    if (e.pageY <= 32 && !this.shown) {
      this.show()
    }
  }

  /*
  * shows bar
  */
  show = () => {
    this.setState({
      barOpacity: spring(1, barAnimationsData.opacitySpring),
      barTop: spring(0, barAnimationsData.topSpring),
      isBarVisible: true
    })
    this.isBarVisible = true
    this.shown = true
  }
  /*
  * hides bar
  */
  hide = () => {
    this.setState({
      barOpacity: spring(0, barAnimationsData.opacitySpring),
      barTop: spring(-20, barAnimationsData.topSpring)
    })
    this.input.value = this.lastText
    this.isBarVisible = false
    this.shown = false
    this.input.blur()
  }
  /*
  * gets suggestions from search engine
  * @param1 {DOMElement} input
  * @param2 {function(data)} callback
  */
  getSearchSuggestions = (input, callback = null) => {
    var inputText = input.value.slice(0, input.selectionStart) + input.value.slice(input.selectionEnd)
    var suggestions = []
    Network.requestUrl('http://google.com/complete/search?client=chrome&q=' + inputText, function (data, error) {
      if (error) {
        if (callback != null) {
          callback(null, error)
        }
        return
      }

      try {
        var json = JSON.parse(data)
        var tempSuggestions = []

        for (var i = 0; i < json[1].length; i++) {
          if (!tempSuggestions.isInArray(json[1][i])) {
            tempSuggestions.push(json[1][i])
          }
        }

        // remove duplicates from array
        var seenSuggestions = []
        for (i = 0; i < tempSuggestions.length; i++) {
          if (!seenSuggestions.isInArray(tempSuggestions[i])) {
            suggestions.push(tempSuggestions[i])
            seenSuggestions.push(tempSuggestions[i])
          }
        }

        // sort array by length
        suggestions.sort(function (a, b) {
          return a.length - b.length
        })

        // set max length for array
        tempSuggestions = []
        var length = 5
        if (suggestions.length > 5) {
          length = 5
        } else {
          length = suggestions.length
        }
        for (i = 0; i < length; i++) {
          tempSuggestions.push(suggestions[i])
        }

        suggestions = tempSuggestions

        if (callback != null) {
          callback(suggestions)
        }
      } catch (e) {
        if (callback != null) {
          callback(null, e)
        }
        return
      }
    })
  }
  /*
  * gets suggestions from history
  * @param1 {DOMElement} input
  * @param2 {function(data)} callback
  */
  getHistorySuggestions = (input, callback = null) => {
    var suggestions = []
    var inputText = input.value.slice(0, input.selectionStart) + input.value.slice(input.selectionEnd)

    Network.requestUrl(historyPath, function (data, error) {
      if (error) {
        if (callback != null) {
          callback(null, error)
        }
        return
      }
      try {
        var json = JSON.parse(data)
        if (inputText !== '') {
          var tempSuggestions = []
          for (var i = 0; i < json.length; i++) {
            var url = json[i].url
            var title = json[i].title
            // remove http:// and www://
            if (url.startsWith('http://')) {
              url = url.split('http://')[1]
              if (url.startsWith('www.')) {
                url = url.split('www.')[1]
              }
            }
            // remove https:// and www://
            if (url.startsWith('https://')) {
              url = url.split('https://')[1]
              if (url.startsWith('www.')) {
                url = url.split('www.')[1]
              }
            }

            var suggestion = {
              url: url,
              title: title
            }

            if (url.startsWith(inputText)) {
              if (!tempSuggestions.isInArray(suggestion)) {
                tempSuggestions.push(suggestion)
              }
            }
          }

          // remove duplicates from array
          var seenSuggestions = []
          for (i = 0; i < tempSuggestions.length; i++) {
            if (!seenSuggestions.isInArray(tempSuggestions[i].url)) {
              suggestions.push(tempSuggestions[i])
              seenSuggestions.push(tempSuggestions[i].url)
            }
          }

          // sort array by length
          suggestions.sort(function (a, b) {
            return a.url.length - b.url.length
          })
        }

        // set max length for array
        tempSuggestions = []
        var length = 5
        if (suggestions.length > 5) {
          length = 5
        } else {
          length = suggestions.length
        }
        for (i = 0; i < length; i++) {
          tempSuggestions.push(suggestions[i])
        }

        suggestions = tempSuggestions

        if (callback != null) {
          callback(suggestions)
        }
      } catch (e) {
        if (callback != null) {
          callback(null, e)
        }
        return
      }
    })
  }
  /*
  * hides suggestions
  */
  hideSuggestions = () => {
    this.setState({
      suggestionsOpacity: spring(0, barAnimationsData.suggestionsOpacitySpring)
    })
    this.isSuggestionsVisible = false
  }
  /*
  * shows suggestions
  */
  showSuggestions = () => {
    this.setState({
      suggestionsOpacity: spring(1, barAnimationsData.suggestionsOpacitySpring),
      isSuggestionsVisible: true
    })
    this.isSuggestionsVisible = true
    this.openedPanel = true
    this.show()
  }
  /*
  * sets text
  * @param1 {String} text
  */
  setText = (text) => {
    this.lastText = text
    this.input.value = text
    this.updateBar(false)
  }
  /*
  * updates bar
  * @param1 {Boolean} suggestions
  */
  updateBar = (suggestions) => {
    if (this.input.value === '') {
      this.setState({isHintVisible: true})
      if (suggestions) {
        this.hideSuggestions()
      }
    } else {
      this.setState({isHintVisible: false})
      if (this.shown && suggestions) {
        this.showSuggestions()
      }
    }
  }
  /*
  * auto completes input with given text
  * @param1 {DOMElement} input
  * @param2 {String} text - text to autocomplete
  */
  autoComplete = (text) => {
    var inputText = this.input.value
    if (text != null || text !== '') {
      if (text.toLowerCase().startsWith(inputText.toLowerCase())) {
        this.input.value = text
        this.input.setSelectionRange(inputText.length, text.length)
      }
    }
  }

  render () {
    var hintStyle = {
      display: (this.state.isHintVisible)
        ? 'block'
        : 'none'
    }
    var inputEvents = {
      onKeyDown: this.onKeyDown,
      onChange: this.onChange,
      onBlur: this.onBlur,
      onFocus: this.onFocus
    }

    return (
      <Motion style={{
        barTop: this.state.barTop,
        barOpacity: this.state.barOpacity,
        suggestionsOpacity: this.state.suggestionsOpacity
      }} onRest={this.onRest}>
        {value => <div>
          <div style={{
            marginTop: value.barTop,
            opacity: value.barOpacity,
            display: (this.state.isBarVisible)
              ? 'block'
              : 'none'
          }} className='bar'>
            <div className='bar-search-icon' />
            <div style={hintStyle} className='bar-hint'>Search</div>
            <input ref={(t) => { this.input = t }} {...inputEvents} className='bar-input' />
          </div>
          <div onClick={this.onSuggestionsClick} className='suggestions' style={{
            opacity: value.suggestionsOpacity,
            display: (this.state.isSuggestionsVisible)
              ? 'block'
              : 'none'
          }}>
            {this.state.suggestionsToCreate.map((object, i) => {
              return <Suggestion key={i} data={object} />
            })}
          </div>
        </div>}
      </Motion>
    )
  }
}
