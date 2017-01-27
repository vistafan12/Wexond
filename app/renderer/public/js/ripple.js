var Ripple = class Ripple {
    static makeRipple(element, xpos, ypos, height, width, time, fadeoutopacity, bgcolor) {
        var $rippleElement = $('<span class="ripple-effect" />'),
            $buttonElement = element,
            btnOffset = $buttonElement.offset(),
            xPos = xpos,
            yPos = ypos,
            size = 0,
            animateSize = parseInt(Math.max(width, height) * Math.PI);
        $rippleElement.css({top: yPos, left: xPos, width: size, height: size, backgroundColor: bgcolor}).appendTo($buttonElement).animate({
            width: animateSize,
            height: animateSize
        }, time, 'linear', function() {});
        $(element).mouseup(function() {
            setTimeout(function() {
                $rippleElement.animate({
                    opacity: fadeoutopacity
                }, {
                    duration: time,
                    queue: false,
                    complete: function() {
                        $rippleElement.remove();
                    }
                });
            }, 125);
        });
        $(element).on('mouseout', function() {
            setTimeout(function() {
                $rippleElement.animate({
                    opacity: fadeoutopacity
                }, {
                    duration: time,
                    queue: false,
                    complete: function() {
                        $rippleElement.remove();
                    }
                });
            }, 125);
        });
        return $rippleElement;
    }
};
