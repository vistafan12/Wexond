export default class Network {
  /*
  * requests url and gets response
  * @param1 {String} url
  * @param2 {function(response)} callback (optional)
  */
  static requestUrl (url, callback = null) {
    var xmlHttp = new XMLHttpRequest()
    xmlHttp.onreadystatechange = function () {
      if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
        if (callback != null) {
          if (xmlHttp.statusText === 'OK') {
            callback(xmlHttp.responseText, null)
          } else {
            callback(xmlHttp.responseText, xmlHttp.statusText)
          }
        }
      }
    }

    xmlHttp.onerror = function (e) {
      callback(xmlHttp.responseText, xmlHttp.statusText)
    }

    xmlHttp.open('GET', url, true)
    xmlHttp.send()
  }
  /*
  * checks if given string is url
  * @param1 {String} string
  * @return {Boolean}
  */
  static isURL (string) {
    var pattern = /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/
    return pattern.test(string)
  }
}
