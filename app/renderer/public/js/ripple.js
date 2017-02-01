var Ripple = class Ripple {
    static makeRipple(element, xpos, ypos, scale, time, scaleY = null) {
        if (scaleY == null){
            scaleY = scale
        }
        var xPos = xpos,
            yPos = ypos,
            size = 0,
            animateSize = parseInt(Math.max(scale, scaleY) * Math.PI);

        var rippleElement = document.createElement("span");
        rippleElement.className = 'ripple-effect';
        element.appendChild(rippleElement);
        rippleElement.css({left: xPos + 'px', top: yPos + 'px'});

        TweenMax.to(rippleElement, time, {
            width: animateSize,
            height: animateSize
        });
        function removeRipple() {
            setTimeout(function() {
                TweenMax.to(rippleElement, time, {
                    opacity: 0,
                    onComplete: function() {
                        if (rippleElement.parentNode != null)
                            rippleElement.parentNode.removeChild(rippleElement);
                    }
                });
            }, 50);
        }
        element.addEventListener('mouseout', removeRipple);
        element.addEventListener('mouseup', removeRipple);
    }
};
