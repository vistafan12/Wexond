'use babel';
import React from 'react';
import ReactDOM from 'react-dom';
import {TweenMax, CSSPlugin} from 'gsap';

export default class Item extends React.Component {
    constructor() {
        super();
        //binds
        this.ripple = this.ripple.bind(this);
        //global properties
    }
    componentDidMount() {

    }
    MouseClick(e) {
        if (e.target == this.refs.root) {
            window.location.href = this.props.url;
        }
    }
    delClick() {

    }
    editClick() {

    }
    ripple(e) {
        var ripple = Ripple.createRipple(this.refs.root, {
            backgroundColor: this.props.rippleColor
        }, createRippleMouse(this.refs.root, e, 1.2));
        Ripple.makeRipple(ripple);
    }
    render() {
        return (
            // href={this.props.url}
            <div ref="root" className="card-item ripple" style={{backgroundColor: this.props.color, color: this.props.fontColor}} onMouseDown={this.ripple} onMouseEnter={this.MouseEnter} onMouseLeave={this.MouseLeave} onClick={this.MouseClick}>
                <img ref="icon" className="icon noselectable" src={this.props.icon} />
                <div ref="title" className="title noselectable">{this.props.name}</div>
            </div>
        );
    }
}
