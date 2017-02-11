'use babel';
import React from 'react';
import ReactDOM from 'react-dom';
import {TweenMax, CSSPlugin} from 'gsap';

export default class Dialog extends React.Component {
    constructor() {
        super();
        //binds
        this.ripple = this.ripple.bind(this);
        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);
        this._add = this._add.bind(this);
        this._cancel = this._cancel.bind(this);
    }

    componentDidMount() {

    }

    show() {
        var t = this;
        TweenMax.to(t.refs.dialog, 0.2, {
            css: {
                marginTop: '0%'
            },
            onComplete: function() {

            }
        });
        t.props.getParent().refs.dark.style.display = 'block';
        TweenMax.to(t.props.getParent().refs.dark, 0.2, {
            css: {
                opacity: 0.8
            },
            onComplete: function() {

            }
        });
        t.refs.dialog.style.display = 'block';
        TweenMax.to(t.refs.dialog, 0.5, {
            css: {
                opacity: 1
            },
            onComplete: function() {

            }
        });
    }

    hide() {
        var t = this;
        t.props.getParent().refs.dark.style.display = 'block';
        TweenMax.to(t.props.getParent().refs.dark, 0.2, {
            css: {
                opacity: 0
            },
            onComplete: function() {
                t.props.getParent().refs.dark.style.display = 'none';
            }
        });
        t.refs.dialog.style.display = 'block';
        TweenMax.to(t.refs.dialog, 0.2, {
            css: {
                opacity: 0
            },
            onComplete: function() {
                t.refs.dialog.style.display = 'block';
            }
        });
        TweenMax.to(t.refs.dialog, 0.2, {
            css: {
                marginTop: '-50%'
            },
            onComplete: function() {

            }
        });
    }
    ripple(e) {
        var ripple = Ripple.createRipple(e.target, {
            backgroundColor: "#3f51b5"
        }, createRippleMouse(e.target, e, 1.2));
        Ripple.makeRipple(ripple);
    }
    _add() {
        if (this.props.onOk != null || this.props.onOk != undefined) {
            this.props.onOk();
        }
    }
    _cancel() {
        if (this.props.onCancel != null || this.props.onCancel != undefined) {
            this.props.onCancel();
        }
    }

    render() {
        return (
            <div className="dialog" ref="dialog">
                <div className="title">Add new card</div>
                <div className="cont">
                    {
                        this.props.children
                    }
                </div>
                <ul className="footer">
                    <li className="ripple" onMouseDown={this.ripple} onClick={this._add}>{this.props.ok}</li>
                    <li className="ripple" onMouseDown={this.ripple} onClick={this._cancel}>{this.props.cancel}</li>
                    <div style={{clear:'both'}}></div>
                </ul>
            </div>
        );
    }
}
