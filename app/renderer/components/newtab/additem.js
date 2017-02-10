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
        var ripple = Ripple.createRipple(this.refs.root, {
            backgroundColor: "#fff"
        }, createRippleMouse(this.refs.root, e));
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
            <div ref="root" className="additem ripple" onClick={this.handleClick} onMouseDown={this.ripple}>
                <div ref="img" style={{transform: this.state.imgRotate}} className="img"></div>
            </div>
        );
    }
}
