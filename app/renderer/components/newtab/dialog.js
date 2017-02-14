'use babel';
import React from 'react';
import ReactDOM from 'react-dom';
import {TweenMax, CSSPlugin} from 'gsap';

export default class Dialog extends React.Component {
    constructor() {
        super();
        //binds
        this.ripple = this.ripple.bind(this);
        this.menuItemRipple = this.menuItemRipple.bind(this);
        this.selectItem = this.selectItem.bind(this);
        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);
        this._add = this._add.bind(this);
        this._cancel = this._cancel.bind(this);
        //global properties
        this.state = {
            lastSelectedItem: null,
            lastSelectedPage: null
        }
    }

    componentDidMount() {
        this.selectItem(this.refs.background, this.refs._background);
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

    menuItemRipple(e) {
        var ripple = Ripple.createRipple(e.target, {
            backgroundColor: "#fff"
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

    selectItem(item, page) {
        var t = this;

        if (this.state.lastSelectedItem != item) {
            if (this.state.lastSelectedItem != null || this.state.lastSelectedItem != undefined) {
                this.state.lastSelectedItem.classList.remove("selected");
            }
            item.className += " selected";
            if (this.state.lastSelectedPage != null || this.state.lastSelectedPage != undefined) {
                this.state.lastSelectedPage.style.display = 'none';
                this.state.lastSelectedPage.style.opacity = 0;
            }
            page.style.display = 'block';
            page.style.opacity = 1;
            this.setState({lastSelectedItem: item});
            this.setState({lastSelectedPage: page});
        }
    }

    render() {
        return (
            <div className="dialog" ref="dialog">
                <ul className="menu">
                    <div className="title">New tab settings</div>
                    <li className="ripple" ref="background" onClick={() => this.selectItem(this.refs.background, this.refs._background)} onMouseDown={this.menuItemRipple}>Background</li>
                    <li className="ripple" ref="cards" onClick={() => this.selectItem(this.refs.cards, this.refs._cards)} onMouseDown={this.menuItemRipple}>Cards</li>
                </ul>
                <ul className="content">
                    <li ref="_background">

                    </li>
                    <li ref="_cards">
                        
                    </li>
                </ul>
            </div>
        );
    }
}
