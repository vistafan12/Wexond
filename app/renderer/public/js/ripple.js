var Ripple = class Ripple {
    static makeRipple(element, xpos, ypos, scale, time) {
        var xPos = xpos,
            yPos = ypos,
            size = 0,
            animateSize = parseInt(Math.max(scale, scale) * Math.PI);

        var rippleElement = document.createElement("span");
        rippleElement.className = 'ripple-effect';
        element.appendChild(rippleElement);
        rippleElement.css({left: xPos + 'px', top: yPos + 'px'});
        console.log(rippleElement.style.left);

        TweenMax.to(rippleElement, time, {
            width: animateSize,
            height: animateSize
        });
        function removeRipple() {
            setTimeout(function() {
                TweenMax.to(rippleElement, time, {
                    opacity: 0,
                    onComplete: function() {
                        rippleElement.parentNode.removeChild(rippleElement);
                    }
                });
            }, 50);
        }
        element.addEventListener('mouseout', removeRipple);
        element.addEventListener('mouseup', removeRipple);
    }
};
