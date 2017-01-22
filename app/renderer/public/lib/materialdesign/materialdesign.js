function doRippleIcon(item, x, y, width, height, rippleTime) {
    return Ripple.makeRipple(item, x, y, width, height, rippleTime, 0)
}

(function ($) {
    //checkbox
    $.fn.checkbox = function (options = {
        rippleTime: 300
    }) {
        var t = this
        t.checked = false
        var defaults = {
            rippleTime: 300
        }
        options = $.extend(defaults, options)
            //append elements
        var mdSwitch = $('<div class="md-checkbox">').appendTo($(t))
        var checkContainer = $('<div class="check-container">').appendTo(mdSwitch)
        var fill = $('<div class="fill">').appendTo(checkContainer)
        var path = $('<div class="fill2">').appendTo(checkContainer)
        var border = $('<div class="border"></div>').appendTo(checkContainer)
        var check1 = $('<div class="check">').appendTo(fill)
        var checkIcon = $('<div class="check-icon"></div>').appendTo(check1)
        
        var lastState = t.checked

        fill.css({
            opacity: 0
        });
        path.css({
            opacity: 0,
            marginLeft: 0
        });

        setInterval(function () {
            if (lastState != t.checked) {
                lastState = t.checked
                if (t.checked) {
                    check()
                    $(t).triggerHandler('checked-changed', {
                        checked: true,
                        userInteraction: false
                    })
                } else {
                    uncheck()
                    $(t).triggerHandler('checked-changed', {
                        checked: false,
                        userInteraction: false
                    })
                }
            }
        }, 1)

        function check() {
            fill.animate({
                opacity: 1
            }, {
                duration: 200,
                queue: false
            });
            path.animate({
                opacity: 1
            }, {
                duration: 75,
                queue: true
            });
            path.animate({
                marginLeft: 24
            }, {
                duration: 350,
                queue: true
            });
            t.checked = true
            lastState = true

        }

        function uncheck() {
            fill.animate({
                opacity: 0
            }, {
                duration: 200,
                queue: false
            });
            path.animate({
                marginLeft: 0
            }, {
                duration: 0,
                queue: false
            });
            path.animate({
                opacity: 0
            }, {
                duration: 100,
                queue: false
            });
            t.checked = false
            lastState = false

        }
        mdSwitch.mousedown(function (e) {
            if (!t.checked) {
                check()
                doRippleIcon($(t), 9, 8, 17, 17, options.rippleTime)
                $(t).triggerHandler('checked-changed', {
                    checked: true,
                    userInteraction: true
                })
            } else {
                uncheck()
                doRippleIcon($(t), 9, 8, 17, 17, options.rippleTime)
                $(t).triggerHandler('checked-changed', {
                    checked: false,
                    userInteraction: true
                })
            }
        })
        return this
    }

    //preloader
    $.fn.preloader = function () {
        var t = this
        $(t).html('\
        <div class="md-preloader">\
            <svg class="svg" xmlns="http://www.w3.org/2000/svg" version="1.1" height="100%" width="100%" viewbox="0 0 75 75">\
                <circle class="preloader-circle" cx="37.5" cy="37.5" r="33.5" stroke="#000" stroke-width="10" />\
            </svg>\
        </div>')
        var lastColor, lastThickness;
        var loader = $(t).find('.md-preloader')
        var circular = $(t).find('.svg')
        var path = $(t).find('.preloader-circle')
        setInterval(function () {
            var color = $(t).attr('color')
            var thickness = $(t).attr('thickness')

            if (lastColor != color) {
                path.css('stroke', color)
                lastColor = color
            }
            if (lastThickness != thickness) {
                path.css('stroke-width', thickness)
                lastThickness = thickness
            }
        }, 1);

        return this
    }

    //switch
    $.fn.switch = function (options = {
        rippleTime: 300
    }) {
        var t = this
        t.switched = false

        var defaults = {
            rippleTime: 300
        }
        options = $.extend(defaults, options)

        var mdSwitch = $('<div class="md-switch">').appendTo($(t))
        var switchContainer = $('<div class="switch-container">').appendTo(mdSwitch)
        var lever = $('<div class="lever">').appendTo(switchContainer)
        var ellipse = $('<div class="ellipse">').appendTo(switchContainer)

        var lastState
        setInterval(function () {
            if (lastState != t.switched) {
                lastState = t.switched
                if (t.switched) {
                    check()
                    $(t).triggerHandler('checked-changed', {
                        checked: true,
                        userInteraction: false
                    })
                } else {
                    uncheck()
                    $(t).triggerHandler('checked-changed', {
                        checked: false,
                        userInteraction: false
                    })
                }
            }
        }, 1)

        function check() {
            ellipse.animate({
                backgroundColor: $(t).attr('lever-color-on')
            }, {
                queue: false,
                duration: 200
            });
            ellipse.animate({
                left: 22
            }, {
                queue: false,
                duration: 200
            });
            lever.animate({
                backgroundColor: $(t).attr('bg-color-on')
            }, {
                queue: false,
                duration: 200
            });
            t.switched = true
            lastState = true
        }

        function uncheck() {
            ellipse.animate({
                backgroundColor: $(t).attr('lever-color-off')
            }, {
                queue: false,
                duration: 200
            });
            ellipse.animate({
                left: -4
            }, {
                queue: false,
                duration: 200
            });
            lever.animate({
                backgroundColor: $(t).attr('bg-color-off')
            }, {
                queue: false,
                duration: 200
            });
            t.switched = false
            lastState = false
        }

        mdSwitch.mousedown(function () {
            if (!t.switched) {
                var ripple = doRippleIcon($(t), 7, 9, 17, 17, options.rippleTime)
                $(ripple).animate({
                    left: 33
                }, {
                    duration: 200,
                    queue: false
                })
                check()
                $(t).triggerHandler('checked-changed', {
                    checked: true,
                    userInteraction: true
                })
            } else {
                var ripple = doRippleIcon($(t), 33, 9, 17, 17, options.rippleTime)
                $(ripple).animate({
                    left: 7
                }, {
                    duration: 200,
                    queue: false
                })
                uncheck()
                $(t).triggerHandler('checked-changed', {
                    checked: true,
                    userInteraction: true
                })
            }
        });
        return this
    }
}(jQuery))