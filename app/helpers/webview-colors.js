import Colors from './colors'

export default class WebViewColors {
  /*
    * gets color from top of website
    * @param1 {<webview>} webview
    * @param2 {function(data)} callback
    */
  static getColorFromTop (webview, callback = null) {
    if (webview != null && webview.getWebContents() != null) {
      webview.capturePage({
        x: 1,
        y: 1,
        width: 2,
        height: 2
      }, function (image) {
        var canvas = document.createElement('canvas')
        var context = canvas.getContext('2d')
        var img = new Image()
        img.onload = function () {
          context.drawImage(img, 0, 0)
          var myData = context.getImageData(1, 1, 1, 1)
          if (myData != null) {
            var color = Colors.rgbToHex(myData.data[0], myData.data[1], myData.data[2])
            if (myData.data[3] === 0) {
              color = '#fff'
            }
            if (callback != null) {
              callback({foreground: WebViewColors.getForegroundColor(color), background: color})
            }
          }
        }
        img.src = image.toDataURL()
        canvas.width = 2
        canvas.height = 2
      })
    }
  }
  /*
    * gets color from html tag <meta name='theme-color'.../>
    * @param1 {String} htmlcode
    * @param2 {function(data)} callback
    */
  static getColorFromSource (htmlcode, callback = null) {
    var color = htmlcode.match(/(\W|^)<meta(.*?((name=('|\')theme-color('|\').*?(content=('|\')(.*?)('|\'))))|.*?((content=('|\')(.*?)('|\')).*?(name=('|\')theme-color('|\'))))[^>]*>(\W|$)/g)[7]
    if (callback != null) {
      callback({foreground: Colors.getForegroundColor(color), background: color})
    }
  }
  /*
    * determines whether to get a color from the code or website
    * @param1 {<webview>} webview
    * @param2 {function(data)} callback
    */
  static getColor (webview, callback = null) {
    if (webview != null && webview.getWebContents() != null) {
      // Checks if <meta name='theme-color' content='...'> tag exists.
      // When it exists, the tab's getting the color from content='...', otherwise it's getting color from top of a website.
      webview.executeJavaScript('function s() {return document.documentElement.innerHTML} s()', false, function (result) {
        var regexp = /<meta name='?.theme-color'?.*>/
        if (regexp.test(result)) {
          // getting color from source (theme-color)
          if (callback != null) {
            WebViewColors.getColorFromSource(result, function (color) {
              callback({foreground: color.foreground, background: color.background})
            })
          }
        } else {
          // getting color from top of a website
          if (callback != null) {
            WebViewColors.getColorFromTop(function (color) {
              callback({foreground: color.foreground, background: color.background})
            })
          }
        }
      })
    }
  }
}
