/*
* adds script tag to document body
* @param1 {Array} arr - array of urls to scripts
*/
function loadScripts (arr) {
  for (var i = 0; i < arr.length; i++) {
    var script = document.createElement('script')
    script.src = arr[i]
    document.body.appendChild(script)
  }
}
/*
* adds class to DOMElement
* @param1 {String} cls - class
*/
Element.prototype.addClass = function (cls) {
  this.classList.add(cls)
}
/*
* removes class from DOMElement
* @param1 {String} cls - class
*/
Element.prototype.removeClass = function (cls) {
  this.classList.remove(cls)
}
/*
* changes or gets style of DOMElement
* @param1 {Object | String} data
* @param2 {String} value (optional)
* @return {Object} - it depends on it if the data param is String and value is null
*/
Element.prototype.css = function (data, value = null) {
  if (typeof (data) === 'object') {
    Object.assign(this.style, data)
  } else {
    if (value != null) {
      this.style[data] = value
    } else {
      return this.style[data]
    }
  }
}
/*
* gets top of DOMElement
* @return {Number}
*/
Element.prototype.getTop = function () {
  var rect = this.getBoundingClientRect()
  return rect.top
}
/*
* gets left of DOMElement
* @return {Number}
*/
Element.prototype.getLeft = function () {
  var rect = this.getBoundingClientRect()
  return rect.left
}
/*
* gets right of DOMElement
* @return {Number}
*/
Element.prototype.getRight = function () {
  var rect = this.getBoundingClientRect()
  return rect.right
}
/*
* gets bottom of DOMElement
* @return {Number}
*/
Element.prototype.getBottom = function () {
  var rect = this.getBoundingClientRect()
  return rect.bottom
}
/*
* gets or sets attribute
* @param1 {String} attribute
* @param2 {String} value (optional)
* @return {String} - depends on it if the value param is null
*/
Element.prototype.attr = function (attribute, value = null) {
  if (value != null) {
    this.setAttribute(attribute, value)
  } else {
    return this.getAttribute(attribute)
  }
}
/*
* gets next element in DOMElement parent's children
* @return {DOMElement}
*/
Element.prototype.next = function () {
  var nodes = Array.prototype.slice.call(this.parentNode.children)
  var index = nodes.indexOf(this)
  var nextElement = nodes[index + 1]
  return nextElement
}
/*
* gets previous element in DOMElement parent's children
* @return {DOMElement}
*/
Element.prototype.previous = function () {
  var nodes = Array.prototype.slice.call(this.parentNode.children)
  var index = nodes.indexOf(this)
  var prevElement = nodes[index - 1]
  return prevElement
}
