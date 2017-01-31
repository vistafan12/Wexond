var iconRippleTime = 0.250;
var rippleTime = 0.4;

function isURL(s) {
    var regexp = /[a-zA-Z-0-9]+\.[a-zA-Z-0-9]{2,3}/;
    return regexp.test(s);
}
function getSelectionText() {
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    return text;
}
function autocomplete(input, text) {
    var inputText = input.value;
    if (text != null || text != "")
        if (text.toLowerCase().startsWith(inputText.toLowerCase())) {
            input.val(text);
            input[0].setSelectionRange(inputText.length, text.length);
        }
    }

function makeRippleMenuItem(menuItem, e) {
    var relX = e.pageX - menuItem.offsetLeft;
    var relY = e.pageY - menuItem.offsetTop;
    Ripple.makeRipple(menuItem, relX, relY, menuItem.clientWidth, rippleTime);
}

function makeRippleIconButton(item) {
    Ripple.makeRipple(item, item.offsetWidth / 2, item.offsetHeight / 2, 12, iconRippleTime);
}

function makeRipple(item, isFromCenter = true, scale = 12, e = null, time = 250) {
    if (isFromCenter) {
        Ripple.makeRipple(item, (item.clientWidth / 2), (item.clientHeight / 2), scale, time);
    } else {
        var relX = e.pageX - item.offsetLeft;
        var relY = e.pageY - $(item).offsetTop;
        Ripple.makeRipple($(menuItem), relX, relY, item.clientWidth, time);
    }
}
function isInArray(value, array) {
    return array.indexOf(value) > -1;
}

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}
function shadeColor(hex, lum) {
    hex = String(hex).replace(/[^0-9a-f]/gi, '');
    if (hex.length < 6) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    lum = lum || 0;
    var rgb = "#",
        c,
        i;
    for (i = 0; i < 3; i++) {
        c = parseInt(hex.substr(i * 2, 2), 16);
        c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
        rgb += ("00" + c).substr(c.length);
    }
    return rgb;
}
function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1
        ? "0" + hex
        : hex;
}
function colorBrightness(color) {
    var r,
        g,
        b,
        brightness,
        colour = color;
    if (colour.match(/^rgb/)) {
        colour = colour.match(/rgba?\(([^)]+)\)/)[1];
        colour = colour.split(/ *, */).map(Number);
        r = colour[0];
        g = colour[1];
        b = colour[2];
    } else if ('#' == colour[0] && 7 == colour.length) {
        r = parseInt(colour.slice(1, 3), 16);
        g = parseInt(colour.slice(3, 5), 16);
        b = parseInt(colour.slice(5, 7), 16);
    } else if ('#' == colour[0] && 4 == colour.length) {
        r = parseInt(colour[1] + colour[1], 16);
        g = parseInt(colour[2] + colour[2], 16);
        b = parseInt(colour[3] + colour[3], 16);
    }
    brightness = (r * 299 + g * 587 + b * 114) / 1000;

    return brightness;
};
function hexToRgb(hex) {
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        }
        : null;
}
function loadScripts(array) {
    var loader = function(src, handler) {
        var script = document.createElement("script");
        script.src = src;
        script.onload = script.onreadystatechange = function() {
            script.onreadystatechange = script.onload = null;
            handler();
        }
        var head = document.getElementsByTagName("head")[0];
        (head || document.body).appendChild(script);
    };
    (function run() {
        if (array.length != 0) {
            loader(array.shift(), run);
        }
    })();
}

Element.prototype.hasClass = function(cls) {
  return !!this.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}

Element.prototype.addClass = function (cls) {
    if (!this.hasClass(cls)) this.className += " " + cls;
}

Element.prototype.removeClass = function (cls) {
    if (this.hasClass(cls)) {
      var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
      this.className = this.className.replace(reg,' ');
    }
}

Element.prototype.css = function (data, value = null) {
    if (typeof(data) === 'object') {
        Object.assign(this.style, data);
    } else {
        if (value != null) {
            this.style[data] = value;
        }
        else {
            return this.style[data];
        }
    }
}

Element.prototype.left = function() {
    var rect = this.getBoundingClientRect();
    return rect.left;
}
