/*
* checks if given string is url
* @param1 {String} string
* @return {Boolean}
*/
//TODO: this function needs to improve
function isURL (string) {
    var regexp = /[a-zA-Z-0-9]+\.[a-zA-Z-0-9]{2,3}/;
    return regexp.test(string);
}
/*
* gets selected text in whole document
* @return {String}
*/
function getSelectionText () {
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    return text;
}
/*
* autocompletes input with given text
* @param1 {DOMElement} input
* @param2 {String} text - text to autocomplete
*/
function autocomplete (input, text) {
    var inputText = input.value;
    if (text != null || text != "") {
        if (text.toLowerCase().startsWith(inputText.toLowerCase())) {
            input.value = text;
            input.setSelectionRange(inputText.length, text.length);
        }
    }
}
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
