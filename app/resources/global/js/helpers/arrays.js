/*
* checks if given value is in array
* @param1 {Object} value
* @return {Boolean}
*/
Array.prototype.isInArray = function (value) {
  return this.indexOf(value) > -1
}
