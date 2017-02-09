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
        
    }

    hide() {

    }

    render() {
        return (
            <div className="dialog">
                <div className="title">Add new card</div>
            </div>
        );
    }
}
