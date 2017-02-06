var iconRippleTime = 0.25;
var rippleTime = 0.8;

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
            input.value = text;
            input.setSelectionRange(inputText.length, text.length);
        }
    }

function makeRippleFromMouse(item, e) {
    var pos = mousePositionElement(e);
    var relX = pos.x;
    var relY = pos.y;
    Ripple.makeRipple(item, relX, relY, item.clientWidth, rippleTime, item.clientHeight);
}

function makeRippleBarButton(item) {
    Ripple.makeRipple(item, item.offsetWidth / 2, item.offsetHeight / 2, 12, iconRippleTime);
}

function makeRippleFromCenter(item, scale = 12, time = 0.25) {
    Ripple.makeRipple(item, (item.clientWidth / 2), (item.clientHeight / 2), scale, time);
}
function isInArray(value, array) {
    return array.indexOf(value) > -1;
}

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}
function mousePositionElement(e) {
	var mousePosDoc = mousePositionDocument(e);
	var target = mouseTarget(e);
	var targetPos = findPos(target);
	var posx = mousePosDoc.x - targetPos.left;
	var posy = mousePosDoc.y - targetPos.top;
	return {
		x : posx,
		y : posy
	};
}
function mouseTarget(e) {
	var targ;
	if (!e) var e = window.event;
	if (e.target) targ = e.target;
	else if (e.srcElement) targ = e.srcElement;
	if (targ.nodeType == 3)
		targ = targ.parentNode;
	return targ;
}
function findPos(obj) {
	var curleft = curtop = 0;
	if (obj.offsetParent) {
		do {
			curleft += obj.offsetLeft;
			curtop += obj.offsetTop;
		} while (obj = obj.offsetParent);
	}
	return {
		left : curleft,
		top : curtop
	};
}
function mousePositionDocument(e) {
	var posx = 0;
	var posy = 0;
	if (!e) {
		var e = window.event;
	}
	if (e.pageX || e.pageY) {
		posx = e.pageX;
		posy = e.pageY;
	}
	else if (e.clientX || e.clientY) {
		posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
	}
	return {
		x : posx,
		y : posy
	};
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
function loadScripts(arr) {
    for (var i = 0; i < arr.length; i++) {
        var script = document.createElement('script');
        script.src = arr[i];
        document.body.appendChild(script);
    }
}

function requestUrl(url, callback = null) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", url, true);
    xmlHttp.send(null);
    xmlHttp.onreadystatechange = function()
    {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        {
            if (callback != null) {
                callback(xmlHttp.responseText);
            }
        }
    };
}

Element.prototype.addClass = function (cls) {
    this.classList.add(cls);
}
Element.prototype.removeClass = function (cls) {
    this.classList.remove(cls);
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

Element.prototype.attr = function(attribute, value = null) {
    if (value != null) {
        this.setAttribute(attribute, value);
        return null;
    } else {
        return this.getAttribute(attribute);
    }
}

Element.prototype.next = function() {
    var nodes = Array.prototype.slice.call(this.parentNode.children),
        index = nodes.indexOf(this),
        nextElement = nodes[index + 1];
    return nextElement;
}
Element.prototype.prev = function() {
    var nodes = Array.prototype.slice.call(this.parentNode.children),
        index = nodes.indexOf(this);
        prevElement = nodes[index - 1];
    return prevElement;
}
