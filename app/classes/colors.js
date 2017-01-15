export default class Colors {
    constructor(webview) {
        this.webview = webview
    }
    /*
    * calculates foreground color based on background color
    * color - String color
    * returns String 'black' or 'white'
    */
    static getForegroundColor(color) {
        var brightness = colorBrightness(color)
        if (brightness < 125) {
            return 'white'
        } else {
            return 'black'
        }
    }

    /*
    * gets color from top of website
    * callback (optional) - function default: null
    */
    getColorFromTop(callback = null) {
        var t = this
        if (typeof(this.webview) !== "undefined" && this.webview != null && this.webview.getWebContents() != null) {
            t.webview.capturePage({
                x: 1,
                y: 1,
                width: 2,
                height: 2
            }, function(image) {
                getPixels(image.toDataURL(), function(err, pixels) {
                    if (err) {
                        console.log("Bad image path")
                        return
                    }
                    var color = rgbToHex(pixels.data[0], pixels.data[1], pixels.data[2])
                    if (pixels.data[3] == 0) {
                        color = "#fff"
                    }
                    if (typeof(callback) === 'function') {
                        callback({foreground: Colors.getForegroundColor(color), background: color})
                    }
                })
            });
        }
    }
    /*
    * gets color from html tag <meta name="theme-color".../>
    * regexp - regular expression
    * result - Object
    * callback (optional) - function default: null
    */
    getColorFromSource(regexp, result, callback = null) {
        var t = this
        var regex = result.match(regexp).toString();
        var color = regex.match(/content="(.*?)"/)[1];
        if (typeof(callback) === 'function') {
            callback({foreground: Colors.getForegroundColor(color), background: color})
        }
    }
    /*
    * determines whether to get a color from the code or website
    * callback (optional) - function default: null
    */
    getColor(callback = null) {
        var t = this
        if (this.webview != null && this.webview.getWebContents() != null) {
            //check if <meta name="theme-color" content="..."> tag exists. When it exists then tab gets the color from content="...", otherwise it getting color from top of a website
            t.webview.executeJavaScript("function s() {var markup = document.documentElement.innerHTML; return markup} s();", false, function(result) {
                var regexp = /<meta name='?.theme-color'?.*>/;
                if (regexp.test(result)) {
                    //getting color from source (theme-color)
                    if (typeof(callback) === 'function') {
                        t.getColorFromSource(regexp, result, function(color) {
                            callback({foreground: color.foreground, background: color.background})
                        })

                    }

                } else {
                    //getting color from top of a website
                    if (typeof(callback) === 'function') {
                        t.getColorFromTop(function(color) {
                            callback({foreground: color.foreground, background: color.background})
                        })

                    }
                }
            });
        }
    }
}
