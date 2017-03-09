'use babel';
import React from 'react';
import ReactDOM from 'react-dom';
import {TweenMax, CSSPlugin} from 'gsap';

export default class Find extends React.Component {
    constructor() {
        super();
        //global properties
        this.openedFind = false;
        this.state = {
            matchesString: "0 / 0",
            visibility: false
        }
    }

    componentDidMount() {

    }
    /*
    * shows/hides find panel
    * @param1 {Boolean} show or hide
    */
    setVisible = (flag) => {
        var t = this;
        if (flag) {
            this.setState({visibility: true});
            TweenMax.to(this.refs.find, 0.2, {
                css:{
                    top: 10,
                    opacity: 0.6
                }
            });
            this.openedFind = true;
        } else {
            TweenMax.to(this.refs.find, 0.2, {
                css:{
                    top: -20,
                    opacity: 0
                }, onComplete: function() {
                    t.setState({visibility: false});
                }
            });
            this.openedFind = false;
        }
    }
    /*
    * returns {boolean} is find panel opened
    */
    isOpened = () => {
        return this.openedFind;
    }

    onKeyPress = () => {
        var text = this.refs.text.value;
        const requestId = this.props.getPage().getWebView().findInPage(text);
    }

    rippleIcon = (e) => {
        var ripple = Ripple.createRipple(e.target, {
        }, createRippleCenter(e.target));
        Ripple.makeRipple(ripple);
    }

    setMatches = (active, max) => {
        this.setState({matchesString: active + "/" + max});
    }

    render() {
        return (
            <div ref="find" className="findpanel" style={{display: (this.state.visibility) ? "block" : "none"}}>
                <input type="text" ref="text" className="textToFind" placeholder="Text to find" onKeyUp={this.onKeyPress}></input>
                <div className="maches no-select" ref="matches">{this.state.matchesString}</div>
                <div className="close ripple no-select" ref="close" onMouseDown={this.rippleIcon} onClick={() => this.setVisible(false)}></div>
            </div>
        );
    }
}
