'use babel';
import React from 'react';
import ReactDOM from 'react-dom';
import {TweenMax, CSSPlugin} from 'gsap';

export default class AddItem extends React.Component {
    constructor() {
        super();
        //binds
        this.ripple = this.ripple.bind(this);
    }
    componentDidMount() {

    }
    ripple(e) {
        var ripple = Ripple.createRipple(e.target, {
            backgroundColor: "#000"
        }, createRippleCenter(e.target, 64, 1));
        Ripple.makeRipple(ripple);
    }
    render() {
        return (
            <div className="additem ripple" onMouseDown={this.ripple}>
                <div className="img"></div>
            </div>
        );
    }
}
