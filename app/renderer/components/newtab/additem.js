'use babel';
import React from 'react';
import ReactDOM from 'react-dom';
import {TweenMax, CSSPlugin} from 'gsap';

export default class AddItem extends React.Component {
    constructor() {
        super();
        //binds
        this.ripple = this.ripple.bind(this);
        this.handleClick = this.handleClick.bind(this);
        //states
        this.state = {
            imgRotate: 'rotate(0deg)',
            active: false
        }
    }
    componentDidMount() {

    }
    ripple(e) {
        var ripple = Ripple.createRipple(e.target, {
            backgroundColor: "#000"
        }, createRippleCenter(e.target, 64, 1));
        Ripple.makeRipple(ripple);
    }
    handleClick(e) {
        if (!this.state.active) {
            this.setState({active: true});
            this.setState({imgRotate: 'rotate(45deg)'});
            //this.props.dialog.show();
            this.props.getParent().refs.dialog.show();
        } else {
            this.setState({active: false});
            this.setState({imgRotate: 'rotate(0deg)'});
        }
    }
    render() {
        return (
            <div className="additem ripple" onClick={this.handleClick} onMouseDown={this.ripple}>
                <div ref="img" style={{transform: this.state.imgRotate}} className="img"></div>
            </div>
        );
    }
}
