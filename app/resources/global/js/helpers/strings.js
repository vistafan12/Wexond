/*
* checks if string ends with given string
* @param1 {String} str
* @return {Boolean}
*/
String.prototype.endsWith = function (str) {
  return this.indexOf(str, this.length - str.length) !== -1
}
