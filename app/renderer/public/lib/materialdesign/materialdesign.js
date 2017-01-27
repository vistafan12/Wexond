(function($) {
    /*
    * checkbox
    *
    * html properties:
    * border-color
    * fill-color
    *
    * events:
    * checked-changed(checked - boolean, userInteraction - boolean)
    */
    $.fn.checkbox = function(options = {
        rippleTime: 300,
        rippleSize: 15
    }) {
        var t = this,
            defaults = {
                rippleTime: 300,
                rippleSize: 15
            },
            //append elements
            mdSwitch = $('<div class="md-checkbox">').appendTo($(t)),
            checkContainer = $('<div class="check-container">').appendTo(mdSwitch),
            fill = $('<div class="fill">').appendTo(checkContainer),
            path = $('<div class="fill2">').appendTo(checkContainer),
            border = $('<div class="border"></div>').appendTo(checkContainer),
            check1 = $('<div class="check">').appendTo(fill),
            checkIcon = $('<div class="check-icon"></div>').appendTo(check1),
            lastState = false,
            lastBorderColor,
            lastFillColor;

        options = $.extend(defaults, options);
        this.checked = lastState;

        //add ripple class for checkbox
        $(t).addClass('ripple-icon');

        //trigger event when checked or unchecked
        setInterval(function() {
            var fillColor = $(t).attr('fill-color'),
                borderColor = $(t).attr('border-color');

            if (lastFillColor != fillColor) {
                $(fill).css('background-color', fillColor);
                $(fill2).css('background-color', fillColor);
                lastFillColor = fillColor;
            }
            if (lastBorderColor != borderColor) {
                $(fill2).css('border', '2px solid ' + borderColor);
                lastBorderColor = borderColor;
            }

            if (lastState != t.checked) {
                lastState = t.checked;
                if (t.checked) {
                    check();
                    $(t).triggerHandler('checked-changed', {
                        checked: true,
                        userInteraction: false
                    });
                } else {
                    uncheck();
                    $(t).triggerHandler('checked-changed', {
                        checked: false,
                        userInteraction: false
                    });
                }
            }
        }, 1);

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

            t.checked = true;
            lastState = t.checked;
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

            t.checked = false;
            lastState = t.checked;
        }

        mdSwitch.mousedown(function(e) {
            if (!t.checked) {
                check();
                Ripple.makeRipple($(t), 9, 8, options.rippleSize, options.rippleSize, options.rippleTime, 0);
                $(t).triggerHandler('checked-changed', {
                    checked: true,
                    userInteraction: true
                });
            } else {
                uncheck();
                Ripple.makeRipple($(t), 9, 8, options.rippleSize, options.rippleSize, options.rippleTime, 0);
                $(t).triggerHandler('checked-changed', {
                    checked: false,
                    userInteraction: true
                });
            }
        });
        return this;
    }

    /*
    * preloader
    *
    * html properties:
    * color
    * thickness
    */
    $.fn.preloader = function() {
        var t = this,
            lastColor,
            lastThickness,
            path = $(t).find('.path');

            $(t).html('\
            <svg class="circular" viewBox="25 25 50 50">\
                <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="5" stroke-miterlimit="10"/>\
            </svg>');

            setInterval(function() {
                var color = $(t).attr('color'),
                    thickness = $(t).attr('thickness');

                if (lastColor != color) {
                    $(t).html(`\
                    <svg class="circular" viewBox="25 25 50 50">\
                        <circle class="path" style="stroke: ${color}; stroke-width: ${thickness};" cx="50" cy="50" r="20" fill="none" stroke-width="5" stroke-miterlimit="10"/>\
                    </svg>`);
                    lastColor = color;
                }
                if (lastThickness != thickness) {
                    $(t).html(`\
                    <svg class="circular" viewBox="25 25 50 50">\
                        <circle class="path" style="stroke: ${color}; stroke-width: ${thickness};" cx="50" cy="50" r="20" fill="none" stroke-width="5" stroke-miterlimit="10"/>\
                    </svg>`);
                    lastThickness = thickness;
                }
            }, 1);

            return this;
        }

        /*
        * switch
        *
        * html properties:
        * primary-color
        * accent-color
        * lever-color-off - default: #F1F1F1
        * bg-color-off - default: #818181
        *
        * events:
        * toggled(state - boolean, userInteraction - boolean)
        */
        $.fn.switch = function(options = {
            rippleTime: 300,
            rippleSize: 15
        }) {
            this.switched = false
            var defaults = {
                    rippleTime: 300,
                    rippleSize: 15
                },
                t = this,
                mdSwitch = $('<div class="md-switch">').appendTo($(t)),
                switchContainer = $('<div class="switch-container">').appendTo(mdSwitch),
                lever = $('<div class="lever">').appendTo(switchContainer),
                ellipse = $('<div class="ellipse">').appendTo(switchContainer),
                lastState;

            options = $.extend(defaults, options)

            //add ripple class for switch
            $(t).addClass('ripple-icon');

            //trigger event when toggled
            setInterval(function() {
                if (lastState != t.switched) {
                    lastState = t.switched;
                    if (t.switched) {
                        toggleOn();
                        $(t).triggerHandler('toggled', {
                            state: true,
                            userInteraction: false
                        });
                    } else {
                        toggleOff();
                        $(t).triggerHandler('toggled', {
                            state: false,
                            userInteraction: false
                        });
                    }
                }
            }, 1);

            function toggleOn() {
                ellipse.animate({
                    backgroundColor: $(t).attr('accent-color')
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
                    backgroundColor: $(t).attr('primary-color')
                }, {
                    queue: false,
                    duration: 200
                });
                t.switched = true;
                lastState = t.switched;

            }

            function toggleOff() {
                ellipse.animate({
                    backgroundColor: '#F1F1F1'
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
                    backgroundColor: '#818181'
                }, {
                    queue: false,
                    duration: 200
                });
                t.switched = false;
                lastState = t.switched;
            }

            mdSwitch.mousedown(function() {
                if (!t.switched) {
                    var ripple = Ripple.makeRipple($(t), 7, 9, options.rippleSize, options.rippleSize, options.rippleTime, 0);
                    $(ripple).animate({
                        left: 33
                    }, {
                        duration: 200,
                        queue: false
                    });
                    toggleOn();
                    $(t).triggerHandler('toggled', {
                        state: true,
                        userInteraction: true
                    });
                } else {
                    var ripple = Ripple.makeRipple($(t), 33, 9, options.rippleSize, options.rippleSize, options.rippleTime, 0);
                    $(ripple).animate({
                        left: 7
                    }, {
                        duration: 200,
                        queue: false
                    })
                    toggleOff();
                    $(t).triggerHandler('toggled', {
                        state: true,
                        userInteraction: true
                    });
                }
            });
            return this;
        }
    }(jQuery))
