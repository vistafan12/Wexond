'use babel';
import React from 'react';
import {TweenMax, CSSPlugin} from 'gsap';

export default class FlatButton extends React.Component {
    constructor() {
        super();
        //binds
        this.onMouseDown = this.onMouseDown.bind(this);
        this._onClick = this._onClick.bind(this);

        //global properties
    }
    componentDidMount() {

    }
    onMouseDown(e) {
        var ripple = Ripple.createRipple(this.refs.button, {
            backgroundColor: this.props.rippleColor
        }, createRippleMouse(this.refs.button, e));
        Ripple.makeRipple(ripple);
    }
    _onClick() {
        var _t = {};
        if(this.props.onFlatButtonClick && _t.toString.call(this.props.onFlatButtonClick) === '[object Function]') {
            this.props.onFlatButtonClick();
        }
    }
    render() {
        return (
            <div onClick={() => this._onClick()} style={this.props.style}>
                <div className="pointer" onMouseDown={this.onMouseDown} style={{opacity: this.props.opacity}}>
                    <div ref="button" className="material-button ripple" style={{backgroundColor: this.props.backgroundColor}}>
                        <div style={{color: this.props.color, opacity: this.props.textOpacity}}>
                            {this.props.children}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

FlatButton.defaultProps = {
    color: '#03A9F4',
    textOpacity: 1,
    opacity: 1,
    backgroundColor: 'transparent',
    rippleColor: '#03A9F4'
};
