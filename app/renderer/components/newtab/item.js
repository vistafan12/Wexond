'use babel';
import React from 'react';
import ReactDOM from 'react-dom';
import {TweenMax, CSSPlugin} from 'gsap';

export default class Item extends React.Component {
    constructor() {
        super();
        //binds
        this.ripple = this.ripple.bind(this);
    }
    componentDidMount() {

    }
    ripple(e) {
        var ripple = Ripple.createRipple(e.target, {
            backgroundColor: this.props.rippleColor
        }, createRippleMouse(e.target, e, 0.6));
        Ripple.makeRipple(ripple);
    }
    render() {
        return (
            <a href={this.props.url} className="item ripple" style={{backgroundColor: this.props.color, color: this.props.fontColor}} onMouseDown={this.ripple}>
                <img className="icon noselectable" src={this.props.icon} />
                <div className="title noselectable">{this.props.name}</div>
            </a>
        );
    }
}
