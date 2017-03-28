/*
* checks if given value is in array
* @param1 {Object} value
* @return {Boolean}
*/
Array.prototype.isInArray = function (value) {
    return this.indexOf(value) > -1;
}
/*
* checks if string ends with given string
* @param1 {String} str
* @return {Boolean}
*/
String.prototype.endsWith = function (str) {
    return this.indexOf(str, this.length - str.length) !== -1;
}
