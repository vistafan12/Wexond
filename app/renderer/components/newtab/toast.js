'use babel';
import React from 'react';
import ReactDOM from 'react-dom';
import {TweenMax, CSSPlugin} from 'gsap';

export default class Toast extends React.Component {
    constructor() {
        super();
        this.show = this.show.bind(this);
    }
    componentDidMount() {

    }
    show() {
        var t = this;
        t.refs.toast.style.display = "block";
        TweenMax.to(t.refs.toast, 0.2, {
            css: {
                marginBottom: 16
            },
            onComplete: function() {

            }
        });
        TweenMax.to(t.refs.toast, 0.2, {
            css: {
                opacity: 1
            },
            onComplete: function() {

            }
        });

        setTimeout(function() {
            TweenMax.to(t.refs.toast, 0.3, {
                css: {
                    marginLeft: "-100%"
                },
                onComplete: function() {

                }
            });
            TweenMax.to(t.refs.toast, 0.3, {
                css: {
                    opacity: 0
                },
                onComplete: function() {

                }
            });
        }, 700);
    }
    render() {
        return (
            <div className="toast" ref="toast">
                {this.props.text}
            </div>
        );
    }
}
