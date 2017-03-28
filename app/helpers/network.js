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
    var pattern = new RegExp('^(https?:\/\/)?'+ // protocol
    '((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|'+ // domain name
    '((\d{1,3}\.){3}\d{1,3}))'+ // ipv4 address
    '(\:\d+)?(\/[-a-z\d%_.~+]*)*'+ // port and path
    '(\?[;&a-z\d%_.~+=-]*)?'+ // query string
    '(\#[-a-z\d_]*)?$','i');
    return regexp.test(pattern)
  }
}
