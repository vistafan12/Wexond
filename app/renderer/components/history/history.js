'use babel';
import React from 'react';
import ReactDOM from 'react-dom';
import Toolbar from '../materialdesign/toolbar.js';
import ToolbarIcon from '../materialdesign/toolbaricon.js';
import ToolbarItem from '../materialdesign/toolbaritem.js';
import ToolbarTitle from '../materialdesign/toolbartitle.js';

import FlatButton from '../materialdesign/flatbutton.js';
import Checkbox from '../materialdesign/checkbox.js';
import Card from '../materialdesign/card.js';
import {CSSPlugin, TweenMax} from 'gsap';

export default class History extends React.Component {
    constructor() {
        super();
        //binds

        //global properties

    }

    componentDidMount() {

    }

    render() {
        return (
            <Toolbar ref="toolbar">
                <ToolbarIcon image="materialdesign/img/menu.png"></ToolbarIcon>
                <ToolbarTitle>Title</ToolbarTitle>
                <ToolbarIcon position="right" image="materialdesign/img/menu.png"></ToolbarIcon>
                <ToolbarItem position="right">
                    <FlatButton textOpacity={0.9} rippleColor="#000" color="#000">
                        BUTTON
                    </FlatButton>
                </ToolbarItem>
            </Toolbar>
        );
    }
}

ReactDOM.render(<History/>, document.getElementById('app'));
