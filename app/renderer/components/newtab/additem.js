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
    handleClick(e) {
        if (!this.state.active) {
            this.setState({active: true});
            this.setState({imgRotate: 'rotate(45deg)'});
            this.props.getParent().refs.dialog_additem.show();
        } else {
            this.setState({active: false});
            this.setState({imgRotate: 'rotate(0deg)'});
            this.props.getParent().refs.dialog_additem.hide();
        }
    }
    render() {
        return (
            <div className="additem">
                <div className="main ripple" ref="main" onClick={this.handleClick} onMouseDown={(e) => this.ripple(e, this.refs.main)}>
                    <div ref="mainImage" className="img"></div>
                </div>
                <ul>
                    <li className="ripple add" ref="add" onMouseDown={this.ripple}>
                        <div className="img"></div>
                    </li>
                    <li className="ripple del" ref="del" onMouseDown={this.ripple}>
                        <div className="img"></div>
                    </li>
                    <li className="ripple edit" ref="edit" onMouseDown={this.ripple}>
                        <div className="img"></div>
                    </li>
                </ul>
            </div>
        );
    }
}
