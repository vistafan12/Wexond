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
        this.toggleToolbar = this.toggleToolbar.bind(this);
        //global properties
        this.toolbars = [];
    }

    componentDidMount() {
        this.toggleToolbar(2);
    }

    toggleToolbar(show) {
        var toolbars = this.toolbars;
        for (var i = 0; i < this.toolbars.length; i++) {
            if (toolbars[i].id == ("t" + show)) {
                toolbars[i].css('display', 'block');
                TweenMax.to(toolbars[i], 0.2, {css:{opacity: 1}});
            } else {
                if (toolbars[i] != null) {
                    var s = toolbars[i];
                    TweenMax.to(toolbars[i], 0.2, {css:{opacity: 0}, onCompleteScope: this, onComplete: function() {
                        s.css('display', 'none');
                    }});
                }
            }
        }
    }

    render() {
        return (
            <div>
                <Toolbar ref="toolbar">
                    <div ref={(r)=>this.toolbars.push(r)} id="t1">
                        <ToolbarTitle>Title</ToolbarTitle>
                    </div>
                    <div ref={(r)=>this.toolbars.push(r)} id="t2">
                        <ToolbarIcon image="browser/img/tabbar/close.png"></ToolbarIcon>
                        <ToolbarItem marginLeft={16}>Selected items: 1</ToolbarItem>
                        <ToolbarItem position="right">
                            <FlatButton textOpacity={0.9} rippleColor="#000" color="#000">
                                DELETE
                            </FlatButton>
                        </ToolbarItem>
                        <ToolbarItem position="right">
                            <FlatButton textOpacity={0.9} rippleColor="#000" color="#000">
                                CANCEL
                            </FlatButton>
                        </ToolbarItem>
                    </div>

                </Toolbar>
            </div>
        );
    }
}

ReactDOM.render(<History/>, document.getElementById('app'));
