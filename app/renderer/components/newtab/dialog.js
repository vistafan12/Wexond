'use babel';
import React from 'react';
import ReactDOM from 'react-dom';
import {TweenMax, CSSPlugin} from 'gsap';

export default class Dialog extends React.Component {
    constructor() {
        super();
        //binds
        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);
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

    render() {
        return (
            <div className="dialog" ref="dialog">
                <div className="title">Add new card</div>
                <div className="cont">
                    {
                        this.props.children
                    }
                </div>
            </div>
        );
    }
}
