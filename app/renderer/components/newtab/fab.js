'use babel';
import React from 'react';
import ReactDOM from 'react-dom';
import {TweenMax, CSSPlugin} from 'gsap';

export default class Fab extends React.Component {
    constructor() {
        super();
        //binds
        this.ripple = this.ripple.bind(this);
        this._click = this._click.bind(this);
    }
    componentDidMount() {

    }
    ripple(e, el) {
        var _el = e.target;
        if (el != null || el != undefined) {
            _el = el;
        }
        var ripple = Ripple.createRipple(_el, {
            backgroundColor: "#fff"
        }, createRippleMouse(_el, e));
        Ripple.makeRipple(ripple);
    }
    _click(e) {
        if (this.props.click != null || this.props.click != undefined) {
            this.props.click();
        }
    }
    render() {
        return (
            <div className="fab">
                <div className="main ripple" ref="main" onClick={this._click} onMouseDown={(e) => this.ripple(e, this.refs.main)}>
                    <div ref="mainImage" className="img"></div>
                </div>
            </div>
        );
    }
}
