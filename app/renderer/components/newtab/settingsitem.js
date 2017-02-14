'use babel';
import React from 'react';
import ReactDOM from 'react-dom';
import {TweenMax, CSSPlugin} from 'gsap';
import CheckBox from '../materialdesign/checkbox.js';

export default class SettingsItem extends React.Component {
    constructor() {
        super();
        //binds

    }

    componentDidMount() {

    }

    render() {
        return (
            <div className="settingsitem" style={{backgroundColor: this.props.color}}>
                <div className="title" style={{color: this.props.fontColor}}>
                    {this.props.name}
                </div>
            </div>
        );
    }
}
